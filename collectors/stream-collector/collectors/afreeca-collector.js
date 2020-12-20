/* eslint-disable */
const useQuery = require('../model/useQuery');

const USER_TABLE = process.env.USER_TARGET_TABLE;
const STREAM_TABLE = process.env.STREAM_TARGET_TABLE;

const getDateFormat = (_date1) => {
  const Date_1 = _date1 instanceof Date ? _date1 : new Date(_date1);
  return `${Date_1.getFullYear()}-${Date_1.getMonth() + 1}-${Date_1.getDate()} ${Date_1.getHours()}:${Date_1.getMinutes()}:${Date_1.getSeconds()}`;
};

// 
const query = (conditionQuery) => `
SELECT A.*, ROUND(AVG(viewer)) as viewer, COUNT(*) AS chatCount, 'afreeca' AS platform
FROM 
(
SELECT 
  creatorId,
  videoId AS streamId,
  videoTitle AS title,
  REPLACE(bookmark,',','') AS fan,
  startDate,
  endDate,
  ROUND(TIMESTAMPDIFF(MINUTE, startDate, endDate) / 60, 1) AS airTime
FROM AfreecaStreams
WHERE creatorId IN ${conditionQuery})  
AND endDate > DATE_SUB(NOW(), INTERVAL 7 DAY) 
AND needCollect = 1
) AS A
LEFT JOIN AfreecaChats  
ON A.streamId = AfreecaChats.videoId
GROUP BY streamId
`;

const getCreators = () => new Promise((resolve, reject) => {
  // 모든 user table에 twitchId 에 대해서 unique key를 걸어줌으로써 1:1 대응으로 바뀐다.
  const creatorListQuery = `
  SELECT userId, afreecaId
  FROM ${USER_TABLE}
  JOIN PlatformAfreecaTest USING (afreecaId)
  `;
  useQuery('tp', creatorListQuery, [])
    .then((row) => {
      const userMap = {};
      const creators = row.result;
      if (creators.length === 0) {
        reject({
          type: false,
          func: 'getCreators',
          msg: `no creators | ${new Date().toLocaleString()}`,
        });
        return;
      }
      creators.forEach((element) => {
        userMap[element.afreecaId] = element.userId;
      });
      resolve({ userMap, creators });
    })
    .catch((error) => {
      console.log(error);
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
  const conditionQuery = creators.reduce((str, element, index) => `${index === 0 ? `(${str}` : `${str},`}'${element.afreecaId}'`, '');

  if (conditionQuery === '') {
    resolve([]);
    return;
  }

  useQuery('collect', query(conditionQuery), [])
    .then((inrow) => {
      const streams = inrow.result;
      const streamData = streams.map((element) => {
        const userId = userMap[element.creatorId];
        return {
          ...element,
          userId,
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
      type: false,
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
        type: true,
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
  UPDATE AfreecaStreams
  SET needCollect = 0
  where videoId in ${conditionQuery});
  `;

  useQuery('collect', updateQuery, [])
    .then(() => {
      resolve();
    })
    .catch((error) => {
      reject({
        type: true,
        func: 'loadStream',
        error,
      });
    });
});

const main = () => new Promise((resolve) => {
  getCreators()
    .then((streamData) => getStreamData(streamData))
    .then((streamData) => Promise.all([
      loadStream(streamData),
      updateState(streamData),
    ]))
    .then(([count]) => {
      console.log(`saved stream: ${count} afreeca-collector end | ${new Date().toLocaleString()}`);
      resolve();
    })
    .catch((error) => {
      if (error.type) {
        console.log({
          func: 'afreeca-collector',
          error,
        });
      } else {
        console.log(`afreeca-collector : ${error.msg}`);
      }
      resolve();
    });
});

module.exports = main;
