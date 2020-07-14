require('dotenv').config(); // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
const axios =  require("axios");
const doQuery = require('./model/calculatorQuery');
const { doTransacQuery } = require('./model/doQuery');

// 1. Youtube의 Creator들에 대한 정보를 제공받는다.
// interface target {
//   type: "creatorId" | "creatorName",
//   value: string //creatorId, creatorName의 실제값.
// }

// 각 순서마다 전달되는 데이터의 형태
// const returnValue = 
// {
//  error : false, // true | false,
//   msg
//   data
// }

//환경변수로 들어가야할 변수들
const API_KEY = 'AIzaSyD5wdcdgFPAAsYyVkvFcHrB-De2vZtjk_8';

// 모든요청을 Request화하여 map으로 돌릴 때는 
const repeater = (data, func) => {
  return new Promise((resolve, reject) => {
    Promise.all(
      data.map((element) => func(element))
    )
      .then((result) => {
        // 존재하지 않는 값에 대한 전처리.
        const output = result.reduce((arr, element)=>{
           if(!element.error){
             arr.push(element.data);
           }else{
            // error의 type을 관찰하기 위해  
             console.log(element.msg);
           }
          return arr;
          }, []);
        resolve(output);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      })
  })
}

// 하나의 ID에 대한 조회 => id를 return 한다.
const getCreatorId = (target) => {
  const { type, value } = target;
  return new Promise((resolve, reject) => {
    if (type === 'creatorId') {
      resolve({
        error : false,
        data : {
          channelId : value,
        },
      });
    } else {
      const url = `https://www.googleapis.com/youtube/v3/channels`;
      const params = {
        part: 'id',
        forUsername: value,
        key: API_KEY
      }
      axios.get(url, { params })
        .then((row) => {
          if (row.data.hasOwnProperty('items')) {
            const { id } = row.data.items[0];
            // id를 DB에 존재여부 확인 후, 추가하는 방향으로 
            resolve({
              error : false,
              data : {
                channelId : id,
              },
            });
          }
          else {
            // 해당 query에 대한 데이터가 존재하지 않는다.
            resolve({
              error: true,
              msg : `${value} has not creator data`
            });
          }
        })
        .catch((err) => {
            resolve({
              error: true,
              msg : err.response.data.error.message
            });
        })
    }
  })
}


// ************************************ 지속적 반복 필요 ***************************************
// 매우 높은 cost의 요청이므로 사용이 불가능하다.
// 하나의 channel ID => video Id in live
const getVideoId = (target) => {
  const { channelId } = target;
  return new Promise((resolve, reject) => {
    const url = `https://www.googleapis.com/youtube/v3/search`;
    const params = {
      part: 'id',
      channelId,
      eventType: 'live',
      order: 'date',
      type: 'video',
      key: API_KEY
    }
    axios.get(url, { params })
      .then((row) => {
        if (row.data.hasOwnProperty('items') && row.data.items.length != 0) {
          const { id } = row.data.items[0];
          const { videoId } = id;
          // id를 DB에 존재여부 확인 후, 추가하는 방향으로 
          resolve({
            error : false,
            data : {
              videoId,
              ...target
            },
          });
        }
        else {
          // 해당 query에 대한 데이터가 존재하지 않는다.
          resolve({
            error: true,
            msg : `${channelId} has not video in live`
          });
        }
      })
      .catch((err) => {
          resolve({
            error: true,
            msg : err.response.data.error.message
          });
      })
  })
}
// ********************************************************************************************

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
const loadLiveVideo = (step1) =>
{
  // input은 channelId를 포함. => 현재 라이브인 데이터 리스트 반환.
  Promise.all([
    repeater(step1, getVideoId),
    getliveChatIdByDB()
  ])
  .then(([liveVideos, dbdata])=>{
    // 실제 방송중인 videoId들 => DB에만 존재하는 값들을 제거.
    const liveVideoIds = [];

    if(!dbdata.error){
      const {videoIds, data} = dbdata.data;

      // 1. 현재 in live인 video인데 DB에 존재하지 않는경우, DB에 적재한다. 
      const newLiveVideos = [];
      liveVideos.forEach((liveVideoData)=>{
        liveVideoIds.push(liveVideoData.videoId);
        if(!videoIds.includes(liveVideoData.videoId))
        {
          newLiveVideos.push(liveVideoData);
        }
      }); 

      // 2. DB에는 존재하는데 liveVideo에는 존재하지 않아서 삭제하는 경우,
      const oldLiveVideos = [];
      data.forEach((dbVideoData)=>{
        if(!liveVideoIds.includes(dbVideoData.videoId))
        {
          oldLiveVideos.push(dbVideoData);
        }
      })

      // 삭제 시작.
      console.log(oldLiveVideos);
      if(oldLiveVideos.length > 0){
        deleteOldVideo(oldLiveVideos);
      }

      //  적재 시작.
      console.log(newLiveVideos);
      if(newLiveVideos.length > 0){
        InsertNewVideo(newLiveVideos);
      }

    }
    else 
    {
      // db에 대한 조회가 불가능한 경우, 모든 list에 대한 API 요청. => liveChatId list 제공.
    }
  })
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
    .then((row)=>{
      resolve();
    })
  });
}

const InsertNewVideo = (newLiveVideos) => {
  // 하나의 쿼리를 이용하기 위해서 쿼리문 만들기.
  const conditionQuery = newLiveVideos.reduce((str, element, index)=>{
    return (index == 0 ? '(' + str : str + ',' )  + `'${element.videoId}'`;
  },'');

  const InsertQuery = 
  `
  DELETE FROM liveVideos
  WHERE videoId
  IN ${conditionQuery});
  `

  return new Promise((resolve, reject)=>{
      doQuery(InsertQuery, [])
        .then((row)=>{
          resolve();
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

const channelIds = [
  { type: 'creatorId', value: 'UCXqlds5f7B2OOs9vQuevl4A' },
  { type: 'creatorId', value: 'UC8pqDEzjWIqWFHH_0mqcuZw' },
  { type: 'creatorId', value: 'UCXsbYbgwmk_zbTTdwCn_1Ig' },
  // { type: 'creatorName', value: 'tvddotty'}
  { type: 'creatorId', value: 'UChQ-VMvdGrYZxviQVMTJOHg' },
]

  
// repeater(channelIds, getCreatorId)
// .then((step1)=>{
//   console.log(step1);
//   repeater(step1, getVideoId)
//   .then((step2)=>{
//     console.log(step2);
//     getliveChatId(step2);
//   })
// })



const main = async () => {
  // const step1 = await repeater(channelIds, getCreatorId);

  const step1 = [
    {channelId : 'UCXqlds5f7B2OOs9vQuevl4A'},
    {channelId : 'UC8pqDEzjWIqWFHH_0mqcuZw' },
    {channelId : 'UCXsbYbgwmk_zbTTdwCn_1Ig' },
    // { type: 'creatorName', value: 'tvddotty'}
    {channelId : 'UChQ-VMvdGrYZxviQVMTJOHg' },
    {channelId : 'UC-toBXJuoumnoRFK26Vvs8Q' }
  ]
  await loadLiveVideo(step1);
}

main();

  