/* eslint-disable */
const useQuery = require('../model/useQuery');
const USER_TABLE = process.env.USER_TARGET_TABLE;
const STREAM_TABLE = process.env.STREAM_TARGET_TABLE;

// 현재 환경(production, dev)에 따른 flag값 분기처리 => entity 변경 등의 issue로 인해 기존 column 사용
const FLAG_COLUMN = process.env.ENV_TYPE === 'production' ? 'needCollect': 'needAnalysis';

const getDateFormat = (_date1) => {
  const Date_1 = _date1 instanceof Date ? _date1 : new Date(_date1);
  return `${Date_1.getFullYear()}-${Date_1.getMonth() + 1}-${Date_1.getDate()} ${Date_1.getHours()}:${Date_1.getMinutes()}:${Date_1.getSeconds()}`;
};

const query = (conditionQuery) => `
SELECT B.* , COUNT(*) AS chatCount
FROM 
(
SELECT  
  streamerId as creatorId, 
  startDate, 
  endDate,
  streamId, 
  A.title, 
  followerCount AS fan, 
  airTime, 
  ROUND(MAX(viewerCount)) AS viewer, 
  'twitch' AS platform
FROM
(
SELECT 
  streamerId, 
  streamId, 
  TwitchStreams.streamerName, 
  startedAt as startDate,
  endedAt as endDate, 
  title, 
  followerCount, 
  ROUND(TIMESTAMPDIFF(MINUTE, startedAt, endedAt) / 60, 1) AS airTime
FROM TwitchStreams
WHERE streamerId IN ${conditionQuery})  
AND endedAt > DATE_SUB(NOW(), INTERVAL 7 DAY)
AND ${FLAG_COLUMN} = 1
) AS A
JOIN TwitchStreamDetails USING (streamId)
GROUP BY streamId
) AS B
LEFT JOIN TwitchChats AS tc
ON B.streamId = tc.streamId
GROUP BY streamId
`;

// 1. 트루포인트 DB에서 계약된 twitchId, userId를 모두 들고온다.
// 2. twitchId : userId로 map을 만든다.
const getCreators = () => new Promise((resolve, reject) => {
  // 모든 user table에 twitchId 에 대해서 unique key를 걸어줌으로써 1:1 대응으로 바뀐다.
  const creatorListQuery = `
  SELECT userId, twitchId
  FROM ${USER_TABLE}
  RIGHT JOIN PlatformTwitch USING (twitchId)
  `;
  useQuery('tp', creatorListQuery, [])
    .then((row) => {
      const userMap = {};
      const creators = row.result;
      creators.forEach((element) => {
        userMap[element.twitchId] = element.userId;
      });
      resolve({ userMap, creators });
    })
    .catch((error) => {
      reject({
        type: true,
        func: 'getCreators',
        error,
      });
    });
});

// 3. 수집기 DB에서 twitchId를 삽입하여 streamData를 수집한다.
// 4. 2번 map을 통해서 streamData에 대해 userId를 대응시킨다.
const getStreamData = ({ userMap, creators }) => new Promise((resolve, reject) => {
  const conditionQuery = creators.reduce((str, element, index) => `${index == 0 ? `(${str}` : `${str},`}'${element.twitchId}'`, '');
  const reg = /[\(\)\'\"]/gi;
  if(conditionQuery === ''){
    resolve([]);
    return;
  }
  useQuery('collect', query(conditionQuery), [])
    .then((inrow) => {
      const streams = inrow.result;
      const streamData = streams.map((element) => {
        const userId = userMap[element.creatorId] ? userMap[element.creatorId] : 'null';
        const title = element.title.replace(reg, '');
        return {
          ...element,
          userId,
          title
        };
      });
      resolve(streamData);
    })
    .catch((error) => {
      reject({
        type: true,
        func: 'getStreamData',
        error,
      });
    });
});

// 5. streamData를 저장한다.
// 6. streamId에 대해서 needCollect를 0으로 둔다.
const loadStream = (streamData) => new Promise((resolve, reject) => {
  if (streamData.length == 0) {
    reject({
      type: true,
      func: 'loadStream',
      msg: `no streams | ${new Date().toLocaleString()}`,
    });
    return;
  }

  const rawQuery = streamData.reduce((str,
    {
      streamId, platform, creatorId, userId, title, viewer, fan, startDate, endDate, airTime, chatCount,
    }) => `${str}('${streamId}', '${platform}', '${creatorId}', '${userId}', '${title}', '${viewer}', '${fan}', '${getDateFormat(startDate)}', '${getDateFormat(endDate)}', '${airTime}', '${chatCount}'),`, '');

  const conditionQuery = `${rawQuery.slice(0, -1)};`;
  const InsertQuery = `
    INSERT INTO ${STREAM_TABLE}
    (streamId, platform, creatorId, userId, title, viewer, fan, startDate, endDate, airTime, chatCount)
    VALUES ${conditionQuery};
    `;

  useQuery('tp', InsertQuery, [])
    .then(() => {
      resolve(streamData.length);
    })
    .catch((error) => {
      reject({
        type: false,
        func: 'loadStream',
        error,
      });
    });
});

const updateState = (streamData) => new Promise((resolve, reject) => {
  if (streamData.length == 0) {
    reject({
      type: false,
      func: 'loadStream',
      msg: `no streams | ${new Date().toLocaleString()}`,
    });
    return;
  }

  const conditionQuery = streamData.reduce((str, element, index) => `${index == 0 ? `(${str}` : `${str},`}'${element.streamId}'`, '');

  const updateQuery = `
  UPDATE TwitchStreams
  SET ${FLAG_COLUMN} = 0
  where streamId in ${conditionQuery});
  `;

  useQuery('collect', updateQuery, [])
    .then(() => {
      resolve(streamData.length);
    })
    .catch((error) => {
      reject({
        type: true,
        func: 'loadStream',
        error,
      });
    });
});

const main = () => new Promise((resolve, reject) => {
  getCreators()
    .then((streamData) => getStreamData(streamData))
    .then((streamData) => Promise.all([
      loadStream(streamData),
      updateState(streamData),
    ]))
    .then(([count]) => {
      console.log(`saved stream: ${count} twitch-collector end | ${new Date().toLocaleString()}`);
      resolve();
    })
    .catch((error) => {
      if (error.type) {
        console.log({
          func: 'twitch-collector',
          error,
        });
      } else {
        console.log(`twitch-collector`);
        console.log(error)
      }
      resolve();
    });
});

module.exports = main;
