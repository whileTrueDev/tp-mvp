const useQuery = require('../model/useQuery');

const getDateFormat = (_date1) => {
  var Date_1 = _date1 instanceof Date ? _date1 :new Date(_date1);
  return `${Date_1.getFullYear()}-${Date_1.getMonth() + 1}-${Date_1.getDate()} ${Date_1.getHours()}:${Date_1.getMinutes()}:${Date_1.getSeconds()}`
}

// JOIN YoutubeTargetStreamers USING (channelId)  
const query = (conditionQuery) => `
SELECT A.*, ROUND(AVG(viewer)) as viewer, COUNT(*) AS chatCount, 'youtube' AS platform
FROM 
(
SELECT 
  channelId AS creatorId, 
  videoId AS streamId, 
  YoutubeStreams.channelName, 
  startDate AS startedAt, 
  videoTitle as title, 
  subscriberCount AS fan, 
  ROUND(TIMESTAMPDIFF(MINUTE, startDate, endDate) / 60, 1) AS airTime
FROM YoutubeStreams
WHERE channelId IN ${conditionQuery})   
AND endDate > DATE_SUB(NOW(), INTERVAL 1 DAY)
AND needCollect = 1
) AS A
LEFT JOIN YoutubeChats 
ON A.streamId = YoutubeChats.videoId
GROUP BY streamId
`

// 1. 트루포인트 DB에서 계약된 youtubeId, userId를 모두 들고온다.
// 2. youtubeId : userId로 map을 만든다.
const getCreators = () => new Promise((resolve, reject)=> {
  // 모든 user table에 twitchId 에 대해서 unique key를 걸어줌으로써 1:1 대응으로 바뀐다.
  const creatorListQuery =
  `
  SELECT userId, youtubeId
  FROM UserTest
  RIGHT JOIN PlatformYoutube USING (youtubeId)
  `;
  useQuery('tp', creatorListQuery, [])
  .then((row)=>{
    const userMap = {};
    const creators = row.result;
    creators.forEach((element)=>{
      userMap[element.youtubeId] = element.userId;
    })
    resolve({userMap, creators});
  })
  .catch((error)=>{
    reject({
      type: true,
      func: 'getCreators',
      error
    });
  })
});


// 3. 수집기 DB에서 twitchId를 삽입하여 streamData를 수집한다.
// 4. 2번 map을 통해서 streamData에 대해 userId를 대응시킨다.
const getStreamData = ({userMap, creators}) => new Promise((resolve, reject)=>{
  const conditionQuery = creators.reduce((str, element, index)=>{
    return (index == 0 ? '(' + str : str + ',' )  + `'${element.youtubeId}'`;
  },'');

  useQuery('collect', query(conditionQuery), [])
  .then((inrow)=>{
    const streams = inrow.result;
    const streamData = streams.map((element)=>{
      const userId = userMap[element.creatorId];
      return {
        ...element,
        userId
      }
    })
    resolve(streamData);
  })
  .catch((error)=>{
    reject({
      type: true,
      func: 'getStreamData',
      error
    });
  })
})

// 5. streamData를 저장한다.
// 6. streamId에 대해서 needCollect를 0으로 둔다.
const loadStream = (streamData) => new Promise((resolve,reject)=>{
  if(streamData.length == 0) {
    reject({
      type: false,
      func : "loadStream",
      msg : `no streams | ${new Date().toLocaleString()}`
    });
    return;
    }

    const rawQuery = streamData.reduce((str, 
        {streamId, platform, creatorId, userId, title, viewer, fan, startedAt, airTime, chatCount }
      )=>{
      return str + `('${streamId}', '${platform}', '${creatorId}', '${userId}', '${title}', '${viewer}', '${fan}', '${getDateFormat(startedAt)}', '${airTime}', '${chatCount}'),`;
    },'');

    const conditionQuery = rawQuery.slice(0,-1) + ';';
    const InsertQuery = 
    `
    INSERT INTO Streams_test
    (streamId, platform, creatorId, userId, title, viewer, fan, startedAt, airTime, chatCount)
    VALUES ${conditionQuery};
    `;

    useQuery('tp', InsertQuery, [])
    .then(()=>{
      resolve(streamData.length);
    })
    .catch((error)=>{
      reject({
        type: true,
        func: 'loadStream',
        error
      });
    })
}) 

const updateState = (streamData) => new Promise((resolve, reject)=>{
  if(streamData.length == 0) {
    reject({
      type: false,
      func : "loadStream",
      msg : `no streams | ${new Date().toLocaleString()}`
    });
    return;
  }

  const conditionQuery = streamData.reduce((str, element, index)=>{
    return (index == 0 ? '(' + str : str + ',' )  + `'${element.streamId}'`;
  },'');

  const updateQuery = `
  UPDATE YoutubeStreams
  SET needCollect = 0
  where videoId in ${conditionQuery});
  `;

  useQuery('collect', updateQuery, [])
  .then(()=>{
    resolve();
  })
  .catch((error)=>{
    reject({
      type: true,
      func: 'loadStream',
      error
    });
  })
})

const main = () => new Promise((resolve, reject)=>{
  getCreators()
  .then((streamData)=>getStreamData(streamData))
  .then((streamData)=>Promise.all([
    loadStream(streamData),
    updateState(streamData)
  ]))
  .then(([count, ])=>{
    console.log(`saved stream: ${count} youtube-collector end | ${new Date().toLocaleString()}`);
    resolve();
  })
  .catch((error)=>{
    if(error.type){
      console.log({
        func: 'youtube-collector',
        error
      })
    }else {
      console.log('youtube-collector : ' + error.msg);
    }
    resolve();
  })
});

module.exports = main;
