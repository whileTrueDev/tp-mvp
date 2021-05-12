/* eslint-disable */
const useQuery = require('../model/useQuery');

const USER_TABLE = process.env.USER_TARGET_TABLE;
const STREAM_TABLE = process.env.STREAM_TARGET_TABLE;

// 현재 환경(production, dev)에 따른 flag값 분기처리
const FLAG_COLUMN = process.env.ENV_TYPE === 'production' ? 'needCollect': 'devCollect';

const getDateFormat = (_date1) => {
  const Date_1 = _date1 instanceof Date ? _date1 : new Date(_date1);
  return `${Date_1.getFullYear()}-${Date_1.getMonth() + 1}-${Date_1.getDate()} ${Date_1.getHours()}:${Date_1.getMinutes()}:${Date_1.getSeconds()}`;
};


// 2020-02-02 크롤러 변경으로 인한 query 수정 => 현재 플랫폼에 대한 제약조건 제거
const query = (conditionQuery) => `
SELECT A.*, ROUND(AVG(REPLACE(viewCount,',',''))) as viewer
FROM
(
  SELECT 
    creatorId, 
    streamId, 
    title, 
    REPLACE(bookmark,',','') AS fan,
    startDate,
    endDate,
    ROUND(TIMESTAMPDIFF(MINUTE, startDate, endDate) / 60, 1) AS airTime, 
    'afreeca' AS platform 
  FROM AfreecaStreamHistory
  # 제약조건 제거
  WHERE endDate IS NOT NULL
  AND ${FLAG_COLUMN} = 1
) AS A
JOIN AfreecaBroadDetail  
ON A.streamId = AfreecaBroadDetail.broadId
GROUP BY streamId;
# WHERE creatorId IN ${conditionQuery})   
`;

// 1. 현재 플랫폼에 계약된 크리에이터에 대한 수집 제약조건을 설정한다. 
// 2. 모든 user table에 twitchId 에 대해서 unique key를 걸어줌으로써 1:1 대응으로 바뀐다.
const getCreators = () => new Promise((resolve, reject) => {
  const creatorListQuery = `
  SELECT userId, afreecaId
  FROM ${USER_TABLE}
  JOIN PlatformAfreeca USING (afreecaId)
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
  const reg = /[\(\)\'\"]/gi;
  if (conditionQuery === '') {
    resolve([]);
    return;
  }

  useQuery('collect', query(conditionQuery), [])
    .then((inrow) => {
      const streams = inrow.result;
      const streamData = streams.map((element) => {
        // userId가 존재하지 않는 경우, null을 사용하도록 한다.
        const userId = userMap.hasOwnProperty(`${element.creatorId}`) ? userMap[element.creatorId] : null;
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
      type: false,
      func: 'loadStream',
      msg: `no streams | ${new Date().toLocaleString()}`,
    });
    return;
  }

  const rawQuery = streamData.reduce((str,
    {
      streamId, platform, creatorId, userId, title, viewer, fan, startDate, endDate, airTime,
    }) => `${str}('${streamId}', '${platform}', '${creatorId}', '${userId}', '${title}', '${viewer}', '${fan}', '${getDateFormat(startDate)}', '${getDateFormat(endDate)}', '${airTime}'),`, '');

  const conditionQuery = `${rawQuery.slice(0, -1)};`;
  const InsertQuery = `
    INSERT INTO ${STREAM_TABLE}
    (streamId, platform, creatorId, userId, title, viewer, fan, startDate, endDate, airTime)
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

  // 2020-02-02 크롤러 변경으로 인한 query 수정 => 수집기준 데이터 테이블 변경, null 값으로 추가
  const updateQuery = `
  UPDATE AfreecaStreamHistory
  SET ${FLAG_COLUMN} = 0
  where streamId in ${conditionQuery});
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

// 2020-02-02 크롤러 변경으로 인한 query 수정 => null 값을 위한 추가 업데이트
const handlingNull = () => new Promise((resolve, reject) => {
  const updateQuery = `
  UPDATE Streams SET userId = NULL WHERE userId = 'null';
  `;

  useQuery('tp', updateQuery, [])
    .then(() => {
      resolve();
    })
    .catch((error) => {
      reject({
        type: true,
        func: 'handlingNull',
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
      handlingNull()
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
