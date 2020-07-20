// API를 통해서 해당 channelID에 대한 videoID를 가져온다.
// channelID => videoID(이미 저장된)
const axios =  require("axios");
const doQuery = require("../model/doQuery");
// const API_KEY = 'AIzaSyD5wdcdgFPAAsYyVkvFcHrB-De2vZtjk_8';
const API_KEY = 'AIzaSyBrcGP6WzgRVaHtiBpjz7y0LmBSJpj6kI0';


// {
//   "kind": "youtube#searchResult",
//   "etag": "qh7NBEoNEy98E9wq9wMKiq9MjLU",
//   "id": {
//     "kind": "youtube#video",
//     "videoId": "sr_6fwHAw5w"
//   }
// }

// 1회 요청시 100 quota
const getVideoData = (target, mergedVideos, nextPageToken) => {
  const channelId = target.value;
  return new Promise((resolve, reject) => {
    const url = `https://www.googleapis.com/youtube/v3/search`;
    const params = {
      part: 'id',
      channelId,
      eventType: 'completed',
      type: 'video',
      key: API_KEY
    }
    if(nextPageToken) {
      params.pageToken = nextPageToken;
    };
    axios.get(url, { params })
      .then((row) => {
        if (row.data.hasOwnProperty('items') && row.data.items.length != 0) {
          row.data.items.forEach((item)=> {
            const { videoId } = item.id;
            mergedVideos.push({ channelId, videoId });
          });
          if(row.data.hasOwnProperty('nextPageToken')){
            resolve({
              error: false,
              nextPageToken : row.data.nextPageToken
            });
          } else {
            resolve({
              error: false,
            });
          }
        }
        else {
          // 해당 query에 대한 데이터가 존재하지 않는다.
          resolve({
            error: true,
            msg : `${channelId} has not message`
          });
        }
      })
      .catch((err) => {
          console.log(err.response.data.error.message);
          resolve({
            error: true,
            msg : err.response.data.error.message
          });
      })
  })
}


const requestRepeat = async (channel, nextPageToken, mergedVideos) => {
  const data = await getVideoData(channel, mergedVideos, nextPageToken);
  if(!data.error && data.nextPageToken){
    console.log(`${channel.value}의 nextPageToken이 존재하므로 한번 더 요청합니다.`);
    await requestRepeat(channel, nextPageToken, mergedVideos);
  }
}

// connection을 통해 연겳해야하는 것들.
// 빈도수를 낮춘다고 했을 때, 지금까지 수집된 모든 chat을 합치고 한번에 INSERT
const requestAPI = (channels) => {
  const mergedVideos = [];
  const forEachPromise = (items, mergedVideos, fn) => items.reduce((promise, item) => promise.then(() => fn(item, null, mergedVideos)), Promise.resolve());
  return new Promise((resolve, reject)=>{
    forEachPromise(channels, mergedVideos, requestRepeat)
      .then(() => {
        resolve(mergedVideos);
      });
  })
}

// 현재 수집된 모든 chat에 대해서 저장하기.
const loadVideo = (mergedVideos) => {
  if(mergedVideos.length == 0) {
    return Promise.reject({
      error : true,
      func : "loadVideo",
      msg : "DB에 적재할 video가 존재하지 않습니다."
    });
  }

  const rawQuery = mergedVideos.reduce((str, {channelId, videoId})=>{
    console.log(` ${channelId} : ${videoId} `);
    return str + `( '${channelId}' , '${videoId}' ),`;
  },'');
  const conditionQuery = rawQuery.slice(0,-1) + ';';

  const InsertQuery = 
  `
  INSERT INTO youtubeVideos
  (channelId, videoId)
  VALUES ${conditionQuery};
  `;

  return new Promise((resolve, reject)=>{
    doQuery(InsertQuery, [])
      .then(()=>{
        resolve();
      })
      .catch((error)=>{
        reject({
            error: true,
            func : "loadVideo",
            msg : error
        });
      })
  });
}


const dbvalues = [
  { type: 'channelId', value: 'UC-Bsa2ivAGWq7bsSPrPGFVA' },
  // { type: 'channelId', value: 'UC9KQaCA_EMobJUxZszQ4wlg' },
  // { type: 'channelId', value: 'UCRY0vKmqFmQ4XCJomWMBf-w' },
  // { type: 'channelId', value: 'UCZXWb_78BrkjpsLHv2bJhUw' },
  // { type: 'channelId', value: 'UCmTjMP2tpOFoFIuKzb4uEhw' },
  // { type: 'channelId', value: 'UCybKp0O2N9sUZOgIm1j2r_w' },
  // { type: 'channelId', value: 'UCfdLDnGcRM3okEOtocWNHuQ' },
  // { type: 'channelId', value: 'UCiCNc3uj8Bnc9bDzHJS058Q' },
  // { type: 'channelId', value: 'UCaS8sePfGIHBU1R6uz04d0g' },
  // { type: 'channelId', value: 'UC2NFRq9s2neD_Ml0tPhNC2Q' },
];


const videoCrawler = () => new Promise((resolve, reject) => {
  requestAPI(dbvalues)
  .then((mergedVideos)=> loadVideo(mergedVideos))
  .then(()=> {console.log("완료")})
  .catch((error)=>{
    reject(error);
  });
});

videoCrawler();