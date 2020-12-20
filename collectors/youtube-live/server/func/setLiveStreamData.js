// 최신화가 필요한 videoId List에 대해서 API 요청을 통해 activeLiveChatId를 추가한다.
// Input format  : [ { channelId, videoId } ... ]
// Output format : [ { channelId, videoId, activeLiveChatId, viewer } ... ]

const axios = require('axios');

// 하나의 video Id => liveChat id  => DB를 통해 간헐적인 요청으로 변경
// 실시간 시청자수, 구독자수를 요청한다.

// videoId => videos/livestreamDetail => livechatid, 실시간 viewer
// channel/list mine  =>  statistics => subscriberCount

const getViewer = (target) => {
  const { videoId } = target;
  return new Promise((resolve, reject) => {
    const url = 'https://www.googleapis.com/youtube/v3/videos';
    const params = {
      part: 'liveStreamingDetails',
      id: videoId,
      key: process.env.API_KEY
    };
    axios.get(url, { params })
      .then((row) => {
        if (row.data.hasOwnProperty('items') && row.data.items.length != 0) {
          const element = row.data.items[0];
          const detail = element.liveStreamingDetails;
          const viewer = detail.hasOwnProperty('concurrentViewers') ? detail.concurrentViewers : 0; // 실시간 시청자 수가 집계가 가능하다. 
          resolve(viewer);
        } else {
          // 해당 query에 대한 데이터가 존재하지 않는다.
          resolve(0);
        }
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 403) {
            // 할당량 초과에 대한 오류핸들링
            // err.response.data.error.message
            reject({
              error: true,
              func: 'getliveChatId',
              msg: `no livechatId (quota exceeded) | ${new Date().toLocaleString()}`
            });
          } else {
            reject({
              error: true,
              func: 'getliveChatId',
              msg: err.response.status
            });
          }
        } else if (err.request) {
          // 요청이 이루어 졌으나 응답을 받지 못했습니다.
          reject({
            error: true,
            func: 'getliveChatId',
            msg: err.request
          });
        } else {
          // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
          reject({
            error: true,
            func: 'getliveChatId',
            msg: err.message
          });
        }
      });
  });
};

const setdetailData = (target, streamData) => {
  const {
    videoId,
    channelId,
    activeLiveChatId,
    startDate,
    nextPageToken
  } = target;

  return new Promise((resolve, reject) => {
    getViewer(target)
      .then((viewer) => {
        streamData.push(
          {
            videoId,
            channelId,
            activeLiveChatId,
            viewer,
            startDate,
            nextPageToken
          }
        );
        resolve();
      })
      .catch((error) => {
        console.log(error);
        streamData.push(
          {
            videoId,
            channelId,
            activeLiveChatId,
            viewer: 0,
            startDate,
            nextPageToken
          }
        );
        resolve();
      });
  });
};

// API 1회 요청의 결과값인 activeLiveChatId를 순차적으로 DB에 삽입시키는 함수.(for loop)
const setLiveStreamData = (liveStreams) => new Promise((resolve, reject) => {
  const streamData = [];
  if (liveStreams.length === 0) {
    reject({
      error: false,
      func: 'setLiveStreamData',
      msg: `no streams on air | ${new Date().toLocaleString()}`
    });
    return;
  }
  const forEachPromise = (items, fn) => items.reduce((promise, item) => promise.then(() => fn(item, streamData)), Promise.resolve());
  forEachPromise(liveStreams, setdetailData)
    .then(() => {
      resolve(streamData);
    });
});

module.exports = setLiveStreamData;
