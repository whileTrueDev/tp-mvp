const { doConnectionQuery } = require('../model/doQuery');
const axios =  require("axios");
const API_KEY = 'AIzaSyD5wdcdgFPAAsYyVkvFcHrB-De2vZtjk_8';

// 10분 전 live였던 video를 DB에서 가져온다.
const getliveChatIdByDB = (connection) =>
{
  return new Promise((resolve, reject)=>{
    const selectQuery = `
    SELECT * 
    FROM youtubeLiveVideos
    `;

    doConnectionQuery({ connection, queryState: selectQuery, params: []})
    .then((row)=>{
      const result = row.result.map(element => {
        return {...element};
      });
      resolve({
        error: false,
        data : result
      });
    })
    .catch((error)=>{
      // DB에 대한 조회가 불가능하더라도 API를 통해 구하여 사용하면 되므로 resolve()를 사용한다.
      reject({
        error: true,
        func : "getliveChatIdByDB",
        msg : error
      });
    });
  })
}

// ************************************ 지속적 반복 필요 ***************************************
// 1회 요청시 7 quota
// activeLiveChatId => live chat message
// 하나의 channel ID => video Id in live
const getChatData = (target, mergedChats, connection) => {
  const { channelId ,videoId, activeLiveChatId, nextPageToken } = target;
  return new Promise((resolve, reject) => {
    const url = `https://www.googleapis.com/youtube/v3/liveChat/messages`;
    const params = {
      part: 'id, snippet',
      liveChatId : activeLiveChatId,
      maxResults: 2000,
      key: API_KEY
    }
    if(nextPageToken) {
      params.pageToken = nextPageToken;
    };
    axios.get(url, { params })
      .then( async (row) => {
        if(row.data.hasOwnProperty('nextPageToken')){
          await loadNextpageToken({videoId, nextPageToken: row.data.nextPageToken, connection});
        }
        if (row.data.hasOwnProperty('items') && row.data.items.length != 0) {
          row.data.items.reverse().forEach((item)=> {
            const { snippet } = item; 
            const authorId = snippet.authorChannelId;
            const time = new Date(snippet.publishedAt).toLocaleString();

            const text = snippet.displayMessage;
            mergedChats.push({ channelId, authorId, time, text });
          });
          resolve({
              error: false,
          });
        }
        else {
          // 해당 query에 대한 데이터가 존재하지 않는다.
          resolve({
            error: true,
            msg : `${channelId} has not message`
          });
        }
      })
      .catch((err) => {
          resolve({
            error: true,
            msg : err.response.data.error.message
          });
      })
  })
}

// 현재 수집된 nextPageToken을 수집한다.
const loadNextpageToken = ({ videoId, nextPageToken, connection }) =>
{
  return new Promise((resolve, reject)=>{ 
    const UpdateQuery = 
    `
    UPDATE youtubeLiveVideos
    SET nextPageToken = ?
    WHERE videoId = ?;
    `;

    doConnectionQuery({ connection, queryState: UpdateQuery, params: [nextPageToken, videoId]})
    .then((row)=>{
      resolve();
    })
    .catch(()=>{
      resolve();
    });
  })
}

// connection을 통해 연겳해야하는 것들.
// 빈도수를 낮춘다고 했을 때, 지금까지 수집된 모든 chat을 합치고 한번에 INSERT
const requestAPI = (liveChats, connection) => {
  const mergedChats = [];
  const forEachPromise = (items, mergedChats, connection, fn) => items.reduce((promise, item) => promise.then(() => fn(item, mergedChats, connection)), Promise.resolve());
  return new Promise((resolve, reject)=>{
    if(liveChats.length === 0){
      resolve(mergedChats);
    } else {
      forEachPromise(liveChats, mergedChats, connection, getChatData)
      .then(() => {
        resolve(mergedChats);
      });
    }
  })
}

const liveChatCrawler = (connection) => new Promise((resolve, reject) => {
  getliveChatIdByDB(connection)
  .then(({error, data}) => requestAPI(data, connection))
  .then((mergedChats)=> {
    resolve(mergedChats);
  })
  .catch((error)=>{
    reject(error);
  });
});

module.exports = liveChatCrawler;
