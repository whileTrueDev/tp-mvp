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
        console.log(err.msg);
        resolve();
      });
    }
  })
});

const main = async () => {

  // 실제 라이브여부 판정
  const f = await front();
  
  // 메세지 수집
  const b = await back();
  return;
}

// 크리에이터의 수가 많아질 수록 오래걸린다.
const f = scheduler.scheduleJob('*/5 * * * *', ()=>{
  front();
})

const b = scheduler.scheduleJob('*/2 * * * *', ()=>{
  back();
})

