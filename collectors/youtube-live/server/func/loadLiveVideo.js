// 현재 DB의 video(10분 전 라이브였던)와 현재 video(현재 라이브인)를 비교 및 동기화.
// 함수의 return은 API를 통해 최신화가 필요한 videoId List를 반환한다.
// Input format  : [ { channelId, videoId } ... ]
// Output format : [ { channelId, videoId } ... ] (new)
const doQuery = require('../model/calculatorQuery');

// 실제 현재 라이브인 video 를 적재하고, live가 종료된 video에 대한 삭제를 진행하는 함수
const loadLiveVideo = (liveVideos) =>
{
  return new Promise((resolve, reject)=> {
    getliveVideoIdByDB()
      .then((dbdata)=>{
        // 실제 방송중인 videoId들 => DB에만 존재하는 값들을 제거.
        const liveVideoIds = [];
        const newLiveVideos = [];
        const oldLiveVideos = [];
        if(!dbdata.error){
          const { videoIds, data } = dbdata.data;
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

          // console.log(newLiveVideos);
          
          // 삭제 및 삽입 실행 
          deleteOldVideo(oldLiveVideos)
          .then(()=> InsertNewVideo(newLiveVideos))
          .then(()=> {
            console.log(newLiveVideos);
            resolve(newLiveVideos);
          })
          .catch((error)=> {
            // 내부의 reject의 경우 밖으로 나가지 않기 때문에 자체적인 error-catch 구현
            console.log(error);
            resolve(liveVideos);
          });
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
        resolve(liveVideos);
      })
  });
}

// live => not live가 된 video로 DB에서 삭제한다. 
const deleteOldVideo = (oldLiveVideos) => {
  if(oldLiveVideos.length == 0) {
    return Promise.resolve();
  }

  const conditionQuery = oldLiveVideos.reduce((str, element, index)=>{
    return (index == 0 ? '(' + str : str + ',' )  + `'${element.videoId}'`;
  },'');

  const deleteQuery = 
  `
  DELETE FROM youtubeLiveVideos
  WHERE videoId
  IN ${conditionQuery});
  `

  return new Promise((resolve, reject)=>{
    doQuery(deleteQuery, [])
      .then(()=>{
        resolve();
      })
      .catch((error)=>{
        reject({
            error: true,
            func : "deleteOldVideo",
            msg : error
        });
      })
  });
}

// not live => live가 된 video로 DB에 적재한다.
const InsertNewVideo = (newLiveVideos) => {
  if(newLiveVideos.length === 0) {
    return Promise.resolve();
  }

  const rawQuery = newLiveVideos.reduce((str, {channelId, videoId})=>{
    return str + `( '${videoId}' , '${channelId}'),`;
  },'');
  const conditionQuery = rawQuery.slice(0,-1) + ';';

  const InsertQuery = 
  `
  INSERT INTO youtubeLiveVideos
  (videoId, channelId)
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
              func : "InsertNewVideo",
              msg : error
          });
        })
  });
}

// 10분 전 live였던 video를 DB에서 가져온다.
const getliveVideoIdByDB = () =>
{
  return new Promise((resolve, reject)=>{
    const selectQuery = `
    SELECT * 
    FROM youtubeLiveVideos
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
      // DB에 대한 조회가 불가능하더라도 API를 통해 구하여 사용하면 되므로 resolve()를 사용한다.
      resolve({
        error: true,
        func : "getliveVideoIdByDB",
        msg : error
      });
    });
  })
}


module.exports = loadLiveVideo;