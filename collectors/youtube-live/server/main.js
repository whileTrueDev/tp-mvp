require('dotenv').config(); // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
const axios =  require("axios");
const getLiveVideo = require("./crawler");
const doQuery = require('./model/calculatorQuery');
const { doTransacQuery } = require('./model/doQuery');
const pool = require('./model/connectionPool');

const API_KEY = 'AIzaSyD5wdcdgFPAAsYyVkvFcHrB-De2vZtjk_8';

const dbvalues = [
  { type: 'creatorId', value: 'UC-Bsa2ivAGWq7bsSPrPGFVA' },
  { type: 'creatorId', value: 'UC9KQaCA_EMobJUxZszQ4wlg' },
  { type: 'creatorId', value: 'UCRY0vKmqFmQ4XCJomWMBf-w' },
  { type: 'creatorId', value: 'UCZXWb_78BrkjpsLHv2bJhUw' },
  { type: 'creatorId', value: 'UCmTjMP2tpOFoFIuKzb4uEhw' },
  { type: 'creatorId', value: 'UCybKp0O2N9sUZOgIm1j2r_w' },
  { type: 'creatorId', value: 'UCfdLDnGcRM3okEOtocWNHuQ' },
  { type: 'creatorId', value: 'UCiCNc3uj8Bnc9bDzHJS058Q' },
  { type: 'creatorId', value: 'UCaS8sePfGIHBU1R6uz04d0g' },
  { type: 'creatorId', value: 'UC2NFRq9s2neD_Ml0tPhNC2Q' },
  { type: 'creatorId', value: 'UCghP93LBNk1EGBr5gFJg20Q' },
  { type: 'creatorId', value: 'UC0-ZCUCeCQBwKU15x0Aqk_g' },
  { type: 'creatorId', value: 'UCY74n-XQJ69dxNdN7h71wLg' },
  { type: 'creatorId', value: 'UCarjMZCmwGZWZwshJXDnA5w' },
  { type: 'creatorId', value: 'UCoYFo-lRD3pchMUtsBcEbOA' },
  { type: 'creatorId', value: 'UCnXe6v0-5vmMMRU2qx0XwUw' },
  { type: 'creatorId', value: 'UCRNq4G2anQUfkvBZWrKYIqw' },
  { type: 'creatorId', value: 'UCHysRIIDpEywTmWl44ZV5Dw' },
  { type: 'creatorId', value: 'UCHe08MV-b1IWnsqRijJj5JQ' },
  { type: 'creatorId', value: 'UCi6QE2TWQ1OWEX1o5TPSz1g' },
  { type: 'creatorId', value: 'UC81LbS19aG9DG7qGyeNEBtA' },
  { type: 'creatorId', value: 'UCHQcF_yN5QSDYAnXb5vaXcg' },
  { type: 'creatorId', value: 'UCkd3KAYGnTNPJZZrPOFeWhA' },
  { type: 'creatorId', value: 'UC2untV6RHYn-FMJe1JZyi-g' },
  { type: 'creatorName', value: 'BuzzBean11' },
  { type: 'creatorName', value: 'skswhdkgo' },
  { type: 'creatorName', value: 'sleepground' },
  { type: 'creatorName', value: 'etbest' },
  { type: 'creatorName', value: 'doejuly' },
  { type: 'creatorName', value: 'cocoa898' },
  { type: 'creatorName', value: 'yumcast11' },
  { type: 'creatorName', value: 'DeliciousGuyM' },
  { type: 'creatorName', value: 'ULSANBIGWHALE' },
];

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
        resolve({
          error: true,
          msg : error.response.data.message
        });
      })
  })
}

// 실제 현재 라이브인 video 를 적재하고, live가 종료된 video에 대한 삭제를 진행하는 함수
// 리턴은 liveDetail에 대한 API를 요청해야하는 video에 대해서 전달한다.
const loadLiveVideo = (liveVideos) =>
{
  return new Promise((resolve, reject)=> {
    getliveChatIdByDB()
      .then( async (dbdata)=>{
        // 실제 방송중인 videoId들 => DB에만 존재하는 값들을 제거.
        const liveVideoIds = [];
        const newLiveVideos = [];
        const oldLiveVideos = [];
        if(!dbdata.error){
          const {videoIds, data} = dbdata.data;
          // 1. 현재 in live인 video인데 DB에 존재하지 않는경우, DB에 적재한다. 
          liveVideos.forEach((liveVideoData)=>{
            liveVideoIds.push(liveVideoData.videoId);
            if(!videoIds.includes(liveVideoData.videoId))
            {
              newLiveVideos.push(liveVideoData);
            }
          }); 
          // 2. DB에는 존재하는데 liveVideo에는 존재하지 않아서 삭제하는 경우,
          data.forEach((dbVideoData)=>{
            if(!liveVideoIds.includes(dbVideoData.videoId))
            {
              oldLiveVideos.push(dbVideoData);
            }
          })

          // 삭제 시작.
          if(oldLiveVideos.length > 0){
            await deleteOldVideo(oldLiveVideos);
          }

          //  적재 시작.
          if(newLiveVideos.length > 0){
            await InsertNewVideo(newLiveVideos);
          }
          resolve(newLiveVideos);
        }
        else 
        {
          // db에 대한 조회가 불가능한 경우, 모든 list에 대한 API 요청. => liveChatId list 제공.
          console.log("DB의 현재 방송 중인 데이터를 조회할 수 없습니다.");
          resolve(liveVideos);
        }
      })
      .catch((error)=>{
        console.log(error);
        reject();
      })
  });
}

const deleteOldVideo = (oldLiveVideos) => {
  // 하나의 쿼리를 이용하기 위해서 쿼리문 만들기.
  const conditionQuery = oldLiveVideos.reduce((str, element, index)=>{
    return (index == 0 ? '(' + str : str + ',' )  + `'${element.videoId}'`;
  },'');

  const deleteQuery = 
  `
  DELETE FROM liveVideos
  WHERE videoId
  IN ${conditionQuery});
  `

  return new Promise((resolve, reject)=>{
    doQuery(deleteQuery, [])
    .then(()=>{
      resolve();
    })
  });
}

const InsertNewVideo = (newLiveVideos) => {
  // 하나의 쿼리를 이용하기 위해서 쿼리문 만들기.
  const rawQuery = newLiveVideos.reduce((str, {channelId, videoId})=>{
    return str + `( '${videoId}' , '${channelId}'),`;
  },'');
  const conditionQuery = rawQuery.slice(0,-1) + ';';

  const InsertQuery = 
  `
  INSERT INTO liveVideos
  (videoId, channelId)
  VALUES ${conditionQuery};
  `;

  return new Promise((resolve, reject)=>{
      doQuery(InsertQuery, [])
        .then(()=>{
          resolve();
        })
        .catch((error)=>{
          console.log(error);
        })
  });
}

// 현재 라이브채팅을 수집하기 위한 대상을 가져온다.
const getliveChatIdByDB = () =>
{
  return new Promise((resolve, reject)=>{
    const selectQuery = `
    SELECT * 
    FROM liveVideos
    `;

    doQuery(selectQuery, [])
    .then((row)=>{
      const videoIds = [];
      const result = row.result.map(element => {
        videoIds.push(element.videoId);
        return {...element};
      });
      resolve({
        error: false,
        data : {
          videoIds, data : result
        }
      });
    })
    .catch((error)=>{
      resolve({
        error: true,
        msg : error
      });
    });
  })
}

// 라이브 챗 값을 들고와서
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
      })
  });

}


// 어짜피 적재해야한다.
const loadLiveChat = (liveChats) => new Promise((resolve, reject) => {
  const forEachPromise = (items, connection, fn) => items.reduce((promise, item) => promise.then(() => fn(item, connection)), Promise.resolve());
  
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
      reject(err);
    } else {
      forEachPromise(liveChats, connection, UpdateNewChatId)
      .then(() => {
        connection.release();
        resolve();
      });
    }
  });
});

const main = async () => {
  const liveVideos = await getLiveVideo(dbvalues);
  // 라이브 챗의 경우, DB값과 크롤링의 값을 비교하여 대상을 확정한다.
  console.log("크롤링 종료");

  // DB의 현재 라이브인 데이터와 비교하여 DB를 최신화, 
  const newLiveVideos = await loadLiveVideo(liveVideos);

  // 새로 라이브를 켠 채널의 activeLiveChat을 가져온다. => 새로 라이브를 켠게 아니라면 요청을 하지 않도록 하기 위해서.
  if(newLiveVideos.length != 0) {
    const liveChats = await getliveChatId(newLiveVideos);
    await loadLiveChat(liveChats);
    console.log("완료");
  }else {
    console.log('새로운 video가 존재하지 않으므로 종료합니다.');
  }

}

main();
