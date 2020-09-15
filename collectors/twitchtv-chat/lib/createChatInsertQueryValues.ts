import { ChatFullInformation } from '../interfaces/chat.interface';

type ChatInsertQuery = string;
type ChatInsertArray = Array<string | number | null | Date | undefined>;
function createChatInsertQueryValues(
  data: ChatFullInformation[]
): [ChatInsertQuery, ChatInsertArray] {
  const insertQuery = `
    INSERT INTO TwitchChats (
      streamerId, time, authorName, authorId, subscriber, manager, badges, text, streamId, playtime
    ) VALUES `;
  let queryArray: ChatInsertArray = [];
  let queryValues: ChatInsertQuery = '';

  data.map((chat, index) => {
    const values = '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const comma = ',\n';

    if (!chat.streamerId || !chat.text || !chat.authorName || !chat.authorId) {
      // 있어서는 안될 데이터.
    } else {
      if (index !== data.length - 1) {
        queryValues += values + comma;
      } else {
        queryValues += values;
      }

      queryArray = queryArray.concat([
        chat.streamerId, // streamerId
        chat.time, // time
        chat.authorName, // authorName
        chat.authorId, // authorId
        chat.subscriber ? 1 : 0, // subscriber
        chat.manager ? 1 : 0, // manager
        chat.badges ? JSON.stringify(chat.badges) : null, // badges
        chat.text, // text
        chat.streamId, // streamId
        chat.playtime, // playtime
      ]);
    }

    return null;
  });

  return [insertQuery + queryValues, queryArray];
}

export default createChatInsertQueryValues;
