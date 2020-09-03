import doQuery, { OkPacket } from './doQuery'; // For data insert
import createChatInsertQueryValues from '../lib/createChatInsertQueryValues'; // For Query
import { Chat } from '../interfaces/chat.interface';

// 계약된 모든 크리에이터 가져오기.
async function getContratedCreators(): Promise<any> {
  const getContractedChannelsQuery = `
  SELECT creatorTwitchId, adChatAgreement
    FROM creatorInfo
    WHERE creatorContractionAgreement = 1`;
  return doQuery(getContractedChannelsQuery)
    .then((row) => {
      if (row.error || !row.result) {
        console.log('[DB적재 에러]');
      }
      return row.result;
    })
    .catch((err) => {
      console.log('err', err);
      throw Error(err);
    });
}

// 채팅로그 버퍼에 쌓인 모든 채팅로그를 적재.
async function insertChats(chatBuffer: Chat[]): Promise<OkPacket> {
  const [insertQuery, insertQueryArray] = createChatInsertQueryValues(chatBuffer);

  // Reqeust query to DB
  return doQuery<OkPacket>(insertQuery, insertQueryArray)
    .then((row) => {
      if (row.error || !row.result) {
        console.log('[DB적재 에러]');
      } else {
        console.log(`[Insert Success] - number of row: ${chatBuffer.length}`);
      }
      return row.result;
    })
    .catch((err) => {
      console.log('err', err);
      throw Error(err);
    });
}

export default {
  getContratedCreators,
  insertChats,
};
