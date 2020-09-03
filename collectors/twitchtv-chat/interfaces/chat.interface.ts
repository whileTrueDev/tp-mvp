import { Badges } from 'tmi.js';

export interface Chat {
  streamerId: string | undefined;
  time: Date;
  name: string | undefined;
  userid: string | undefined;
  subscriber: boolean | undefined;
  manager: boolean | undefined;
  badges: Badges | undefined;
  text: string;
}

export interface ChatContainer {
  chatCount: number;
  insertedChatCount: number;
  chatBuffer: Array<Chat>;
}
