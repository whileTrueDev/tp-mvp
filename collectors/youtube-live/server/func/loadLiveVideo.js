// 현재 DB의 video(10분 전 라이브였던)와 현재 video(현재 라이브인)를 비교 및 동기화.
// 함수의 return은 API를 통해 최신화가 필요한 videoId List를 반환한다.
// Input format  : [ { channelId, videoId } ... ]
// Output format : [ { channelId, videoId } ... ] (new)
const doQuery = require('../model/calculatorQuery');
const setStreamData = require('./setStreamData');

// 실제 현재 라이브인 video 를 적재하고, live가 종료된 video에 대한 삭제를 진행하는 함수
const loadLiveVideo = (liveVideos, accessTokenDic) =>
{
  return new Promise((resolve, reject)=> {
    getliveVideoIdByDB()
      .then((dbdata)=>{
        // 실제 방송중인 videoId들 => DB에만 존재하는 값들을 제거.
        const liveVideoIds = [];
        const newLiveVideos = [];
        const oldLiveVideos = [];
        const updateVideos = [];
        if(!dbdata.error){
          const { tokenDic, videoIds, data } = dbdata.data;
          // 1. 현재 in live인 video인데 DB에 존재하지 않는경우, DB에 적재한다. 
          const liveStreams = liveVideos.map((liveVideoData)=>{
            liveVideoIds.push(liveVideoData.videoId);
            if(!videoIds.includes(liveVideoData.videoId))
            {
              newLiveVideos.push(liveVideoData);
            }
            // 할당량 이슈로 인해 activeLiveChatId가 null 값으로 들어간경우, 재요청을 실시한다.
            if(liveVideoData.activeLiveChatId == null){
              updateVideos.push(liveVideoData);
            }

            // videoId에 수집된 nextPageToken을 집어넣어준다.
            const nextPageToken = tokenDic.hasOwnProperty(liveVideoData.videoId) ? tokenDic[liveVideoData.videoId] : null;
            return {
              ...liveVideoData,
              nextPageToken
            }
          }); 

          // 2. DB에는 존재하는데 liveVideo에는 존재하지 않아서 삭제하는 경우,
          data.forEach((dbVideoData)=>{
            if(!liveVideoIds.includes(dbVideoData.videoId))
            {
              // videoId에 대해서 access token을 가져야한다. 
              const accessToken = tokenDic.hasOwnProperty(dbVideoData.videoId) ? tokenDic[dbVideoData.videoId].accessToken : null;
              oldLiveVideos.push(
                { 
                  ...dbVideoData,
                  accessToken
                }
              );
            }
          })

          // 삭제 및 삽입 실행 
          Promise.all(
           [
            deleteOldVideo(oldLiveVideos),
            setStreamData(oldLiveVideos, accessTokenDic)
           ] 
          )
          .then(()=> Promise.all([
            InsertLiveData(newLiveVideos),
            InsertMetaData(newLiveVideos)
          ]))
          .then(()=> {
            // resolve(newLiveVideos.concat(updateVideos)); => 따로 activeLiveChat을 수집할 필요가 없다.
            resolve(liveStreams);
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
  DELETE FROM YoutubeActiveStreams
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
const InsertLiveData = (newLiveVideos) => {
  if(newLiveVideos.length === 0) {
    return Promise.resolve();
  }

  const rawQuery = newLiveVideos.reduce((str, { channelId, videoId, activeLiveChatId, startDate})=>{
    return str + `('${channelId}', '${videoId}', '${activeLiveChatId}', '${startDate}'),`;
  },'');
  const conditionQuery = rawQuery.slice(0,-1) + ';';

  const InsertQuery = 
  `
  INSERT INTO YoutubeActiveStreams
  (channelId, videoId, activeLiveChatId, startDate)
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
              func : "InsertLiveData",
              msg : error
          });
        })
  });
}


// not live => live가 된 video로 DB에 적재한다.
const InsertMetaData = (newLiveVideos) => {
  if(newLiveVideos.length === 0) {
    return Promise.resolve();
  }

  const rawQuery = newLiveVideos.reduce((str, {videoId, videoTitle, channelId, channelName, startDate})=>{
    return str + `( '${videoId}', '${videoTitle}', '${channelId}', '${channelName}', '${startDate}'),`;
  },'');
  const conditionQuery = rawQuery.slice(0,-1) + ';';

  const InsertQuery = 
  `
  INSERT INTO YoutubeStreams
  (videoId, videoTitle, channelId, channelName, startDate)
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
              func : "InsertMetaData",
              msg : error
          });
        })
  });
}

// 3분 전 live였던 video를 DB에서 가져온다.
// 현재까지 수집된 nextPageToken을 dict으로 만들어서 현재 방송중인 데이터에 추가한다.
const getliveVideoIdByDB = () =>
{
  return new Promise((resolve, reject)=>{
    const selectQuery = `
    SELECT * 
    FROM YoutubeActiveStreams
    `;

    doQuery(selectQuery, [])
    .then((row)=>{
      const videoIds = [];
      const tokenDic = {};
      const result = row.result.map(element => {
        videoIds.push(element.videoId);
        tokenDic[element.videoId] = element.nextPageToken;
        return {...element};
      });
      resolve({
        error: false,
        data : {
          tokenDic, videoIds, data : result
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