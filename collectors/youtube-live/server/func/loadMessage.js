const { doConnectionQuery } = require('../model/doQuery');

// 현재 수집된 모든 chat에 대해서 저장하기.
const loadMessage = (mergedChats, connection) => {
  if(mergedChats.length == 0) {
    return Promise.reject({
      error : true,
      func : "loadMessage",
      msg : "DB에 적재할 새로운 채팅이 존재하지 않습니다."
    });
  }

  const rawQuery = mergedChats.reduce((str, {videoId, channelId, authorId, time, text})=>{
    return str + `('${videoId}', '${channelId}' , '${authorId}', '${time}' , '${text}'),`;
  },'');
  const conditionQuery = rawQuery.slice(0,-1) + ';';

  const InsertQuery = 
  `
  INSERT INTO youtubeChat
  (videoId, channelId, authorId, time, text)
  VALUES ${conditionQuery};
  `;

  return new Promise((resolve, reject)=>{
    doConnectionQuery({ connection, queryState: InsertQuery, params: [] })
      .then(()=>{
        console.log(`저장된 채팅 수 : ${mergedChats.length}`);
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