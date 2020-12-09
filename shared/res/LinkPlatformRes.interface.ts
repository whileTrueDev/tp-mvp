import { User } from '../interfaces/User.interface';

export type AlreadyLinked = 'already-linked';
export type LinkPlatformRes = User | AlreadyLinked;

export interface LinkPlatformError {
  message: string;
  data: {
    platformUserName: string;
    userId: string;
  }
}
