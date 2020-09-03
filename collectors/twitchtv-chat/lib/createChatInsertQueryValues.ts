import { Chat } from '../interfaces/chat.interface';

type ChatInsertQuery = string;
type ChatInsertArray = Array<string | number | null | Date | undefined>;
function createChatInsertQueryValues(data: Chat[]): [ChatInsertQuery, ChatInsertArray] {
  const insertQuery = `
    INSERT INTO TwitchChats
    ( streamerId, time, authorName, authorId, subscriber, manager, badges, text )
    VALUES `;
  let queryArray: ChatInsertArray = [];
  let queryValues: ChatInsertQuery = '';

  data.map((chat, index) => {
    const values = '(?, ?, ?, ?, ?, ?, ?, ?)';
    const comma = ',\n';

    if (!chat.streamerId || !chat.text || !chat.name || !chat.userid) {
      // 있어서는 안될 데이터.
    } else {
      if (index !== data.length - 1) {
        queryValues += values + comma;
      } else {
        queryValues += values;
      }

      queryArray = queryArray.concat([
        chat.streamerId, chat.time, chat.name, chat.userid,
        chat.subscriber ? 1 : 0, chat.manager ? 1 : 0,
        chat.badges ? JSON.stringify(chat.badges) : null, chat.text
      ]);
    }


    return null;
  });

  return [insertQuery + queryValues, queryArray];
}

export default createChatInsertQueryValues;
