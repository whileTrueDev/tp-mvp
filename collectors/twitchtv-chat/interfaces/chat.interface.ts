import { Badges } from 'tmi.js';

export interface Chat {
  streamerId: string | undefined;
  authorName: string | undefined;
  authorId: string | undefined;
  subscriber: boolean | undefined;
  manager: boolean | undefined;
  badges: Badges | undefined;
  text: string;
  time: Date;
}

export interface ChatContainer {
  chatCount: number;
  insertedChatCount: number;
  chatBuffer: Array<Chat>;
}

export interface ChatFullInformation extends Chat {
  streamId?: string;
  playtime?: string | Date;
}
