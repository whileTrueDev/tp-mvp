const axios =  require("axios");
// <두번째 전략>
// 3. header의 access token을 추가함으로서 livebroadcasts(my broadcasts)의 ID를 가져온다.
// 4. videoId => liveChatId
// 5. livechatMessages

const getDateFormat = (_date1) => {
  var Date_1 = _date1 instanceof Date ? _date1 :new Date(_date1);
  return `${Date_1.getFullYear()}-${Date_1.getMonth() + 1}-${Date_1.getDate()} ${Date_1.getHours()}:${Date_1.getMinutes()}:${Date_1.getSeconds()}`
}

// targets = [{ channelId, access_token }, ...] 에 대해서 하나만 간주한다.
const getActiveStream = (target, liveData) => {
  const { channelId, channelName, accessToken } = target;
  return new Promise((resolve, reject) => {
    const url = `https://www.googleapis.com/youtube/v3/liveBroadcasts`;

    const params = {
      part: 'snippet',
      broadcastStatus: 'active',
      key: process.env.API_KEY
    }

    const headers = {
      'Authorization' : 'Bearer ' + accessToken,
      'Accept' : 'application/json'
    }

    axios.get(url, { params, headers })
      .then((row) => {
        if (row.data.hasOwnProperty('items') && row.data.items.length != 0) {
          // 방송이 진행중인 라이브 방송이 존재한다는 의미이다.
          row.data.items.forEach((element) => {
            const videoId = element.id;
            const details = element.snippet;

            const timeObject = new Date(element.snippet.actualStartTime);
            const startDate = getDateFormat(timeObject);
            // 시작시간에 대한 한국시간으로 변환
            liveData.push(
              {
                channelId,
                channelName,
                accessToken,
                videoId,
                videoTitle : details.title.replace(/\\/g, '').replace(/\'/g, ' '),
                startDate,
                activeLiveChatId: details.liveChatId
              }
            )
          });
        }
        resolve();
      })
      .catch((err) => {
        if (err.response) {
          if(err.response.status == 403){
            // 할당량 초과에 대한 오류핸들링
            // err.response.data.error.message
            reject({
              error: true,
              func : "getActiveStream",
              msg: `no livechatId (quota exceeded) | ${new Date().toLocaleString()}`
            })
          } else {
            reject({
              error: true,
              func : "getActiveStream",
              msg : err.response.status
            });
          }
        }
        else if (err.request) {
          // 요청이 이루어 졌으나 응답을 받지 못했습니다.
          reject({
            error: true,
            func : "getActiveStream",
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

// DB에 저장하는 것이 아닌, 현재 방송중인 데이터의 총 집합을 반환한다.
const getActiveStreams = (targets) => new Promise((resolve, reject) => {
  const liveData = [];
  const forEachPromise = (items, fn) => items.reduce((promise, item) => promise.then(() => fn(item, liveData)), Promise.resolve());
  forEachPromise(targets, getActiveStream)
  .then(() => {
    resolve(liveData);
  })
  .catch((error)=>{
    console.log(error);
    resolve(liveData);
  });
});

module.exports = getActiveStreams;
