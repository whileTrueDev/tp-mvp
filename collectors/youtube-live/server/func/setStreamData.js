const axios =  require("axios");
const { doConnectionQuery } = require('../model/doQuery');
const pool = require('../model/connectionPool');

// targets = [{ channelId, access_token }, ...] 에 대해서 하나만 간주한다.
const getSubscriberCount = (target, accessToken) => {
  // 추후에 사용될 수 있으므로 target은 남겨둠.
  // const { channelId } = target;

  return new Promise((resolve, reject) => {
    const url = `https://www.googleapis.com/youtube/v3/channels`;

    const params = {
      part: 'statistics',
      mine: 'true',
      key: process.env.API_KEY
    }

    const headers = {
      'Authorization' : 'Bearer ' + accessToken,
      'Accept' : 'application/json'
    }

    axios.get(url, { params, headers })
      .then((row) => {
        if (row.data.hasOwnProperty('items') && row.data.items.length != 0) {
          const element = row.data.items[0];
          const detail = element.statistics;
          // "statistics": {
          //   "viewCount": "0",
          //   "commentCount": "0",
          //   "subscriberCount": "0",
          //   "hiddenSubscriberCount": false,
          //   "videoCount": "0"
          // }
          const subscriberCount = detail.subscriberCount;
          resolve(subscriberCount);
        }
        else {
          resolve(0);
        }
      })
      .catch((err) => {
        if (err.response) {
          if(err.response.status == 403){
            // 할당량 초과에 대한 오류핸들링
            // err.response.data.error.message
            reject({
              error: true,
              func : "getSubscriberCount",
              msg: `no livechatId (quota exceeded) | ${new Date().toLocaleString()}`
            })
          } else {
            reject({
              error: true,
              func : "getSubscriberCount",
              msg : err.response.status
            });
          }
        }
        else if (err.request) {
          // 요청이 이루어 졌으나 응답을 받지 못했습니다.
          reject({
            error: true,
            func : "getSubscriberCount",
            msg : err.request
          });
        }
        else {
          // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
          reject({
            error: true,
            func : "getActiveStream",
            msg : err.message
          });
        }
      })
  })
}

const getDateFormat = (_date1) => {
  var Date_1 = _date1 instanceof Date ? _date1 :new Date(_date1);
  return `${Date_1.getFullYear()}-${Date_1.getMonth() + 1}-${Date_1.getDate()} ${Date_1.getHours()}:${Date_1.getMinutes()}:${Date_1.getSeconds()}`
}


// 현재 수집된 nextPageToken을 수집한다.
const loadSubscriberCount = ({ videoId, subscriberCount, connection, endDate }) =>
{
  return new Promise((resolve, reject)=>{ 
    const UpdateQuery = 
    `
    UPDATE YoutubeStreams
    SET subscriberCount = ?, endDate = ?, needCollect = 1, needAnalysis = 1
    WHERE videoId = ?;
    `;

    doConnectionQuery({ connection, queryState: UpdateQuery, params: [subscriberCount, endDate, videoId]})
    .then(()=>{
      resolve();
    })
    .catch(()=>{
      resolve();
    });
  })
}

// 스트림이 종료될 때, 스트림에 대한 데이터를 저장하는 영역.
// then()을 통해 스트림에 대해 저장할 데이터를 추가하면 된다.
const setdetailData = (target, connection, accessTokenDic) => {
  const { videoId, channelId } = target;
  const accessToken = accessTokenDic[channelId];
  const endDate = getDateFormat(new Date());
  return new Promise((resolve, reject)=>{
    getSubscriberCount(target, accessToken)
    .then((subscriberCount)=> loadSubscriberCount({ videoId, subscriberCount, connection, endDate }))
    .then(()=>{
      resolve();
    })
    .catch((error)=>{
      console.log(error);
      resolve();
    })
  })
}

const setStreamData = (oldStreams, accessTokenDic) => new Promise((resolve, reject) => {
  const forEachPromise = (items, connection, fn) => items.reduce((promise, item) => promise.then(() => fn(item, connection, accessTokenDic)), Promise.resolve());
  pool.getConnection((error, connection) => {
    if (error) {
      reject({
        error: true,
        func : "back",
        msg : error
      });
    } else {   
      forEachPromise(oldStreams, connection, setdetailData)
      .then(() => {
        connection.release();
        resolve();
      })
      .catch((err)=>{
        connection.release();
        console.log(err);
        resolve();
      });
    }
  })
});

module.exports = setStreamData;