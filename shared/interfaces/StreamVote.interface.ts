import { Stream } from './Stream.interface';

export interface StreamVote {
  id: number;

  stream: Stream

  vote: boolean;

  userIp: string;

  userId?: string;

  createDate?: string | Date;
}
