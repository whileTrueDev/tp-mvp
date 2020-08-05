require('dotenv').config(); // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
const getLiveVideo = require("./func/liveVideoCrawler");
const loadLiveVideo = require('./func/loadLiveVideo');
const loadLiveChat = require('./func/loadLiveChat');
const liveMessageCrawler = require('./func/liveMessageCrawler');
const loadMessage = require('./func/loadMessage');
const loadChannelId = require('./func/loadChannelId');

const pool = require('./model/connectionPool');
const scheduler = require('node-schedule');
//  error data format
// {
//   error: true,
//   func : "getliveChatId",
//   msg : error.response.data.message
// }

// 크롤링을 통해 라이브 방송 중인 videoId 수집하는 전단.
// 약 3분 소요 => 오래걸린다.
const front = () => new Promise((resolve, reject) => {
    loadChannelId()
    .then((dbvalues)=> getLiveVideo(dbvalues))
    .then((liveVideos) => loadLiveVideo(liveVideos))
    .then((newLiveVideos) => loadLiveChat(newLiveVideos))
    .then(()=> {
      resolve();
    })
    .catch((error)=> {
      console.log(error.msg);
      resolve();
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

// 실제 라이브여부 판정
const f = scheduler.scheduleJob('*/5 * * * *', ()=>{
  front();
})

// 메세지 수집
const b = scheduler.scheduleJob('*/2 * * * *', ()=>{
  back();
})

// 정의한 리눅스 사용자 계정의 권한을 사용하기 위한 option
// docker run --init --cap-add=SYS_ADMIN --name youtube-crawler -d -v /etc/localtime:/etc/localtime:ro --env-file ./.env youtube-crawler:2.1