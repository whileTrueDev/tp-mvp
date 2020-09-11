import mysql from 'mysql';
import doQuery, { OkPacket } from './doQuery'; // For data insert
import createChatInsertQueryValues from '../lib/createChatInsertQueryValues'; // For Query
import { Chat } from '../interfaces/chat.interface';
import { Streamer } from '../interfaces/streamer.interface';
import { Stream } from '../interfaces/stream.interface';

// 계약된 모든 크리에이터 가져오기.
async function getTargetStreamers(pool: mysql.Pool): Promise<Streamer[]> {
  const getContractedChannelsQuery = `
    SELECT streamerChannelName
    FROM TwitchTargetStreamers
    WHERE streamerChannelName IS NOT NULL`;
  return doQuery<Streamer[]>(pool, getContractedChannelsQuery)
    .then((row) => {
      if (row.error || !row.result) {
        console.log('[DB Select 에러] - getTargetStreamers');
      }
      return row.result;
    })
    .catch((err) => {
      console.log('err', err);
      throw Error(err);
    });
}

// 현재 진행중인 stream 정보 가져오기
async function getCurrentStreams(pool: mysql.Pool): Promise<Stream[]> {
  const getCurrentStreamQuery = `
  SELECT ts.streamId, ts.streamerName, ts.streamerId, ts.startedAt
    FROM TwitchStreamDetails AS tsd
    JOIN TwitchStreams as ts ON tsd.streamId = ts.streamId
    WHERE tsd.createdAt > date_sub(NOW(), INTERVAL 4 MINUTE)
    GROUP BY streamId
    ORDER BY tsd.createdAt DESC`;
  return doQuery<Stream[]>(pool, getCurrentStreamQuery)
    .then((row) => {
      if (row.error || !row.result) {
        console.log('[DB Select 에러] - getCurrentStream');
      }
      return row.result;
    })
    .catch((err) => {
      console.log('err', err);
      throw Error(err);
    });
}

// 채팅로그 버퍼에 쌓인 모든 채팅로그를 적재.
async function insertChats(pool: mysql.Pool, chatBuffer: Chat[]): Promise<OkPacket> {
  const [insertQuery, insertQueryArray] = createChatInsertQueryValues(chatBuffer);

  // Reqeust query to DB
  return doQuery<OkPacket>(pool, insertQuery, insertQueryArray)
    .then((row) => {
      if (row.error || !row.result) {
        console.log('[DB적재 에러] - insertChats');
      }
      return row.result;
    })
    .catch((err) => {
      console.log('err', err);
      throw Error(err);
    });
}

export default {
  getTargetStreamers,
  getCurrentStreams,
  insertChats,
};
