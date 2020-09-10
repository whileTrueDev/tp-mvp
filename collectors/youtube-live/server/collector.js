require('dotenv').config(); // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.

const loadTokens = require('./func/loadTokens');
const getActiveStream = require('./func/getActiveStream');
const loadLiveVideo = require('./func/loadLiveVideo');
const setLiveStreamData = require('./func/setLiveStreamData');
const liveCollector = require('./func/liveCollector');

//  error data format
// {
//   error: true,
//   func : "getliveChatId",
//   msg : error.response.data.message
// }
const main = () => {
  const accessTokenDic = {};
  loadTokens(accessTokenDic)
  .then((targets)=> getActiveStream(targets))
  .then((activeStreams)=>loadLiveVideo(activeStreams, accessTokenDic))
  .then((liveStreams)=> setLiveStreamData(liveStreams))
  .then((liveStreamData)=> liveCollector(liveStreamData))
  .then(()=>{
    console.log(`collector end | ${new Date().toLocaleString()}`);
  })
  .catch((err)=>{
    console.log(err.msg);
  })
}

const scheduler = require('node-schedule');
const b = scheduler.scheduleJob('*/2 * * * *', ()=>{
  main();
})

// 정의한 리눅스 사용자 계정의 권한을 사용하기 위한 option
// docker run --init --cap-add=SYS_ADMIN --name youtube-crawler -d -v /etc/localtime:/etc/localtime:ro --env-file ./.env youtube-crawler:2.1
