require('dotenv').config(); // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
const getLiveVideo = require("./func/liveVideoCrawler");
const loadLiveVideo = require('./func/loadLiveVideo');
const loadLiveChat = require('./func/loadLiveChat');
const liveMessageCrawler = require('./func/liveMessageCrawler');
const loadMessage = require('./func/loadMessage');
const pool = require('./model/connectionPool');

const dbvalues = require('./data');
//  error data format
// {
//   error: true,
//   func : "getliveChatId",
//   msg : error.response.data.message
// }

// 전단.
const front = () => new Promise((resolve, reject) => {
    getLiveVideo(dbvalues)
    .then((liveVideos) => loadLiveVideo(liveVideos))
    .then((newLiveVideos) => loadLiveChat(newLiveVideos))
    .then(()=> {
      console.log("전단 종료");
      resolve();
    })
    .catch((error)=> {
      console.log(error);
      reject(error);
    })
});

// 후단
const back = () => new Promise((resolve, reject) => {
  pool.getConnection((error, connection) => {
    if (error) {
      reject({
        error: true,
        func : "back",
        msg : error
      });
    } else {
      liveMessageCrawler(connection)
      .then((mergedChats)=> loadMessage(mergedChats, connection))
      .then(()=>{
        connection.release();
        console.log("후단 종료");
        resolve();
      })
      .catch((err)=>{
        connection.release();
        reject({
          error: true,
          func : "back",
          msg : err
        });
      });
    }
  })
});

const main = async () => {
  const f = await front();
  const b = await back();
}

main();