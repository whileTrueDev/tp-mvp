const { google } = require('googleapis');
const doQuery = require('../model/calculatorQuery');

//  refresh token을 타겟 크리에이터에서 가져와서 하나씩 갱신한다. 
const loadTokens = (accessTokenDic) => {
  const accessTokens = [];
  
  const loadAccessToken = (item) => {
    return new Promise((resolve, reject)=>{
      oauth2Client.setCredentials({
        refresh_token: item.refresh_token 
      });
      oauth2Client.refreshAccessToken(function(err, tokens){
        if(err){
          console.log(err);
          resolve();
        }
        accessTokens.push({
          channelId : item.channelId,
          channelName: item.channelName,
          accessToken : tokens.access_token
        });
        accessTokenDic[item.channelId] = tokens.access_token
        resolve();
      })
    });
  };

  const selectQuery = 
  `
  SELECT channelId, channelName, refresh_token
  FROM YoutubeTargetStreamers
  `;

  return new Promise((resolve, reject)=>{
    doQuery(selectQuery, [])
      .then((row)=>{
        forEachPromise(row.result, loadAccessToken)
        .then(() => {
          resolve(accessTokens);
        });
      })
      .catch((error)=>{
        console.log({
          error: true,
          func : "loadTokens",
          msg : error
        });
        resolve(accessTokens);
      })
  });
}

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URL
);

const forEachPromise = (items, fn) => items.reduce((promise, item) => promise.then(() => fn(item)), Promise.resolve());

module.exports = loadTokens;