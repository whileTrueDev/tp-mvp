// 최신화가 필요한 videoId List에 대해서 API 요청을 통해 activeLiveChatId를 추가한다.
// Input format  : [ { channelId, videoId } ... ]
// Output format : [ { channelId, videoId, activeLiveChatId, viewer } ... ]

const axios =  require("axios");
const { doTransacQuery } = require('../model/doQuery');
const pool = require('../model/connectionPool');
const API_KEY = 'AIzaSyD5wdcdgFPAAsYyVkvFcHrB-De2vZtjk_8';

// 하나의 video Id => liveChat id  => DB를 통해 간헐적인 요청으로 변경
const getliveChatId = (targets) => {
  const channelDic = {};
  return new Promise((resolve, reject) => {
    const url = `https://www.googleapis.com/youtube/v3/videos`;
    const ids = targets.reduce((acc, target, index) => {
      channelDic[target.videoId] = target.channelId;
      return (index == 0 ? target.videoId : acc + ',' + target.videoId);
    }, '');
    const params = {
      part: 'liveStreamingDetails',
      id: ids,
      key: API_KEY
    }
    axios.get(url, { params })
      .then((row) => {
        if (row.data.hasOwnProperty('items') && row.data.items.length != 0) {
          const result = row.data.items.reduce((arr, element) => {
            const videoId = element.id;
            const details = element.liveStreamingDetails;
            arr.push(
              {
                channelId : channelDic[videoId],
                videoId,
                viewer: details.concurrentViewers,
                activeLiveChatId: details.activeLiveChatId
              }
            )
            return arr;
          },[]);
          resolve(result);
        }
        else {
          // 해당 query에 대한 데이터가 존재하지 않는다.
          resolve({
            error: true,
            msg : `No live streaming`
          });
        }
      })
      .catch((error) => {
        console.log(error);
        reject({
          error: true,
          func : "getliveChatId",
          msg : error.response.data.message
        });
      })
  })
}

// API 1회 요청의 결과값인 activeLiveChatId를 순차적으로 DB에 삽입시키는 함수.(for loop)
const loadLiveChat = (liveChats) => new Promise((resolve, reject) => {
  const forEachPromise = (items, connection, fn) => items.reduce((promise, item) => promise.then(() => fn(item, connection)), Promise.resolve());
  pool.getConnection((error, connection) => {
    if (error) {
      reject({
        error: true,
        func : "loadLiveChat",
        msg : error
      });
    } else {
      forEachPromise(liveChats, connection, UpdateNewChatId)
      .then(() => {
        connection.release();
        resolve();
      });
    }
  });
});

// API를 통해 요청된 activeLiveChatId를 삽입하는 함수
const UpdateNewChatId = ({ videoId, activeLiveChatId }, connection) => {
  const UpdateQuery = 
  `
  UPDATE liveVideos
  SET activeLiveChatId = ?
  WHERE videoId = ?;
  `;

  return new Promise((resolve, reject)=>{
    doTransacQuery({ connection, queryState: UpdateQuery, params:[activeLiveChatId,videoId] })
      .then(()=>{
        resolve();
      })
      .catch((error)=>{
        console.log(error);
        resolve();
      })
  });
}

const main = (newLiveVideos) => {
  return new Promise((resolve, reject)=> {
    // 새로 라이브를 켠 채널의 activeLiveChat을 가져온다. => 새로 라이브를 켠게 아니라면 요청을 하지 않도록 하기 위해서.
    if(newLiveVideos.length != 0) {
      getliveChatId(newLiveVideos)
      .then(liveChats => loadLiveChat(liveChats))
      .then(() => { resolve(); })
      .catch((error)=>{
        reject(error);
      });
    }else {
      console.log('새로운 video가 존재하지 않으므로 종료합니다.');
      resolve();
    }
  })
}

module.exports = main;
