require('dotenv').config(); // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
const doQuery = require('../model/calculatorQuery');

// 10분 전 live였던 video를 DB에서 가져온다.
const loadChannelId = () =>
{
  return new Promise((resolve, reject)=>{
    const selectQuery = `
    SELECT channelId
    FROM youtubeCreators
    `;

    doQuery(selectQuery, [])
    .then((row)=>{
      const result = row.result.map(element => {
        return {
          type: "creatorId",
          value: element.channelId
        };
      });
      resolve(result);
    })
    .catch((error)=>{
      console.log(error);
      reject({
        error: true,
        func : "loadChannelId",
        msg : error
      });
    });
  })
}

module.exports = loadChannelId;
