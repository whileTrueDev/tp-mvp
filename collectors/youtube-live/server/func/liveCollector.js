/* eslint-disable */
const liveMessageCollector = require('./liveMessageCollector');
const loadMessage = require('./loadMessage');
const pool = require('../model/connectionPool');

const liveCollector = (liveStreamData) => new Promise((resolve, reject) => {
  pool.getConnection((error, connection) => {
    if (error) {
      reject({
        error: true,
        func: 'back',
        msg: error
      });
    } else {
      liveMessageCollector(liveStreamData, connection)
        .then((mergedChats) => loadMessage(mergedChats, connection))
        .then(() => {
          connection.release();
          resolve();
        })
        .catch((err) => {
          connection.release();
          reject(err);
        // console.log(err.msg);
        // resolve();
        });
    }
  });
});

module.exports = liveCollector;
