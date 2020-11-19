import { User } from '../interfaces/User.interface';

export type AlreadyLinked = 'already-linked';
export type LinkPlatformRes = User | AlreadyLinked;
