require('dotenv').config(); // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
const getLiveVideo = require("./func/liveVideoCrawler");
const loadLiveVideo = require('./func/loadLiveVideo');
const loadLiveChat = require('./func/loadLiveChat');
const liveMessageCrawler = require('./func/liveMessageCrawler');
const loadMessage = require('./func/loadMessage');
const pool = require('./model/connectionPool');
const scheduler = require('node-schedule');
const dbvalues = require('./data');
//  error data format
// {
//   error: true,
//   func : "getliveChatId",
//   msg : error.response.data.message
// }

// 크롤링을 통해 라이브 방송 중인 videoId 수집하는 전단.
// 약 3분 소요 => 오래걸린다.
const front = () => new Promise((resolve, reject) => {
    getLiveVideo(dbvalues)
    .then((liveVideos) => loadLiveVideo(liveVideos))
    .then((newLiveVideos) => loadLiveChat(newLiveVideos))
    .then(()=> {
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
        console.log("---------------------------------------------------");
        resolve();
      })
      .catch((err)=>{
        connection.release();
        console.log(err);
        reject(err);
      });
    }
  })
});

const main = async () => {
  const f = await front();
  const b = await back();
  return;
}

// scheduler.scheduleJob('0,4,8,12,16,20,24,28,32,36,40,44,48,52,56 * * * *', ()=>{
//   main();
// })

main();