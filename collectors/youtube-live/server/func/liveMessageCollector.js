/* eslint-disable */
const axios = require('axios');
const { doConnectionQuery } = require('../model/doQuery');

const getPlayTime = (_date1, _date2) => {
  const diffDate_1 = _date1 instanceof Date ? _date1 : new Date(_date1);
  const diffDate_2 = _date2 instanceof Date ? _date2 : new Date(_date2);
  let diff = (diffDate_2.getTime() - diffDate_1.getTime());

  if (diff <= 0) {
    return '00:00:00';
  }

  let hour = parseInt(diff / (1000 * 60 * 60));
  diff -= (hour * (1000 * 60 * 60));
  let minute = parseInt(diff / (1000 * 60));
  diff -= (minute * (1000 * 60));
  let second = parseInt(diff / (1000));

  hour = hour.toString().padStart(2, '0');
  minute = minute.toString().padStart(2, '0');
  second = second.toString().padStart(2, '0');
  return `${hour}:${minute}:${second}`;
};

// WINDOW : 2020-8-4 11:10:14 ├F10: AM┤
// LINUX  : 8/4/2020, 10:54:01 AM
const getDateFormat = (_date1) => {
  const Date_1 = _date1 instanceof Date ? _date1 : new Date(_date1);
  return `${Date_1.getFullYear()}-${Date_1.getMonth() + 1}-${Date_1.getDate()} ${Date_1.getHours()}:${Date_1.getMinutes()}:${Date_1.getSeconds()}`;
};

// ************************************ 지속적 반복 필요 ***************************************
// 1회 요청시 7 quota
// activeLiveChatId => live chat message
// 하나의 channel ID => video Id in live
const getChatData = (target, mergedChats, connection) => {
  const {
    videoId, activeLiveChatId, nextPageToken, startDate, viewer
  } = target;
  return new Promise((resolve, reject) => {
    if (activeLiveChatId == null) {
      // activeLiveChatId가 null인경우에는 요청하지 않도록 한다.
      // => quota exceeded가 아닌데 다른 chat에 대해서도 불가능하면 안된다.
      console.log(`${videoId} hasn't activeLiveChatId`);
      resolve({
        error: false,
      });
      return;
    }
    const url = 'https://www.googleapis.com/youtube/v3/liveChat/messages';
    const params = {
      part: 'id, snippet',
      liveChatId: activeLiveChatId,
      maxResults: 2000,
      key: process.env.API_KEY
    };
    if (nextPageToken) {
      params.pageToken = nextPageToken;
    }
    axios.get(url, { params })
      .then(async (row) => {
        if (row.data.hasOwnProperty('nextPageToken')) {
          await loadNextpageToken({ videoId, nextPageToken: row.data.nextPageToken, connection });
        }
        if (row.data.hasOwnProperty('items') && row.data.items.length != 0) {
          row.data.items.reverse().forEach((item) => {
            const { snippet } = item;
            const authorId = snippet.authorChannelId;
            const timeObject = new Date(snippet.publishedAt);
            const time = getDateFormat(timeObject);
            const play_time = getPlayTime(startDate, timeObject);
            // 데이터 저장시 필요한 전처리 -> \ 글자, 따옴표에 대한 처리
            const text = snippet.displayMessage.replace(/\\/g, '').replace(/\'/g, ' ');
            mergedChats.push({
              videoId, authorId, time, play_time, text, viewer
            });
          });
          resolve({
            error: false,
          });
        } else {
          // 해당 query에 대한 데이터가 존재하지 않는다.
          resolve({
            error: true,
            msg: `${channelId} has not message`
          });
        }
      })
      .catch((err) => {
        // 종료하고 난 뒤에 비공개로 떨구게 되면 catch로 오류가 발생한다. => 다음 갱신시에 바뀐다.
        if (err.response) {
          if (err.response.status == 403) {
            // 할당량 초과에 대한 오류핸들링
            // err.response.data.error.message

            // 채팅 데이터를 수집하려고보니 과거의 channelId를 비공개하면서 생김.
            resolve({
              error: true,
              msg: `${videoId} is private or quota exceeded | ${new Date().toLocaleString()}`
            });
          } else {
            resolve({
              error: true,
              msg: err.response.status
            });
          }
        } else if (err.request) {
          // 요청이 이루어 졌으나 응답을 받지 못했습니다.
          resolve({
            error: true,
            msg: err.request
          });
        } else {
          // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
          resolve({
            error: true,
            msg: err.message
          });
        }
      });
  });
};

// 현재 수집된 nextPageToken을 수집한다.
const loadNextpageToken = ({ videoId, nextPageToken, connection }) => new Promise((resolve, reject) => {
  const UpdateQuery = `
    UPDATE YoutubeActiveStreams
    SET nextPageToken = ?
    WHERE videoId = ?;
    `;

  doConnectionQuery({ connection, queryState: UpdateQuery, params: [nextPageToken, videoId] })
    .then(() => {
      resolve();
    })
    .catch(() => {
      resolve();
    });
});

// connection을 통해 연겳해야하는 것들.
// 빈도수를 낮춘다고 했을 때, 지금까지 수집된 모든 chat을 합치고 한번에 INSERT
const requestAPI = (liveChats, connection) => {
  const mergedChats = [];
  const forEachPromise = (items, mergedChats, connection, fn) => items.reduce((promise, item) => promise.then(() => fn(item, mergedChats, connection)), Promise.resolve());
  return new Promise((resolve, reject) => {
    if (liveChats.length === 0) {
      resolve(mergedChats);
    } else {
      forEachPromise(liveChats, mergedChats, connection, getChatData)
        .then(() => {
          resolve(mergedChats);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

const liveChatCrawler = (targets, connection) => new Promise((resolve, reject) => {
  requestAPI(targets, connection)
    .then((mergedChats) => {
      resolve(mergedChats);
    })
    .catch((error) => {
      reject(error);
    });
});

module.exports = liveChatCrawler;
