const { doConnectionQuery } = require('../model/doQuery');

// 현재 수집된 모든 chat에 대해서 저장하기.
const loadMessage = (mergedChats, connection) => {
  if(mergedChats.length == 0) {
    return Promise.reject({
      error : true,
      func : "loadMessage",
      msg : `채팅이 존재하지 않습니다. ${new Date().toLocaleString()}`
    });
  }

  const rawQuery = mergedChats.reduce((str, {videoId, authorId, time, play_time, text})=>{
    return str + `('${videoId}', '${authorId}', '${time}', '${play_time}', '${text}'),`;
  },'');
  const conditionQuery = rawQuery.slice(0,-1) + ';';

  const InsertQuery = 
  `
  INSERT INTO youtubeChat
  (videoId, authorId, time, playTime, text)
  VALUES ${conditionQuery};
  `;

  return new Promise((resolve, reject)=>{
    doConnectionQuery({ connection, queryState: InsertQuery, params: [] })
      .then(()=>{
        console.log(`저장된 채팅 수 : ${mergedChats.length} | ${new Date().toLocaleString()}`);
        resolve();
      })
      .catch((error)=>{
        console.log(conditionQuery);
        reject({
            error: true,
            func : "loadMessage",
            msg : error
        });
      })
  });
}

module.exports = loadMessage;