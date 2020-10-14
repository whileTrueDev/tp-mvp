import { User } from './User.interface';

export interface Subscribe {
  index: number;

  user: User;

  targetUserId: string;

  startAt: Date;

  endAt: Date;
}
