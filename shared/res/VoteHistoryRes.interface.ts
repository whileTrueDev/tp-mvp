import { StreamVote } from '../interfaces/StreamVote.interface';

export type VoteHistoryRes = StreamVote & { type: 'up' | 'down' };
