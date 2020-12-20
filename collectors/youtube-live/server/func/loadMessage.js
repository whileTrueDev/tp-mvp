const { doConnectionQuery } = require('../model/doQuery');

// 현재 수집된 모든 chat에 대해서 저장하기.
const loadMessage = (mergedChats, connection) => {
  if (mergedChats.length === 0) {
    return Promise.reject({
      error: false,
      func: 'loadMessage',
      msg: `no chats | ${new Date().toLocaleString()}`
    });
  }

  const rawQuery = mergedChats.reduce((str, {
    videoId, authorId, time, play_time, text, viewer
  }) => `${str}('${videoId}', '${authorId}', '${time}', '${play_time}', '${text}', '${viewer}'),`, '');
  const conditionQuery = `${rawQuery.slice(0, -1)};`;

  const InsertQuery = `
  INSERT INTO YoutubeChats
  (videoId, authorId, time, playTime, text, viewer)
  VALUES ${conditionQuery};
  `;

  return new Promise((resolve, reject) => {
    doConnectionQuery({ connection, queryState: InsertQuery, params: [] })
      .then(() => {
        console.log(`stored chat count : ${mergedChats.length} | ${new Date().toLocaleString()}`);
        resolve();
      })
      .catch((error) => {
        console.log(conditionQuery);
        reject({
          error: true,
          func: 'loadMessage',
          msg: error
        });
      });
  });
};

module.exports = loadMessage;
