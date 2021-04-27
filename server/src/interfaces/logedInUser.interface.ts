import { Request } from 'express';
import { UserEntity } from '../resources/users/entities/user.entity';

export type UserLoginPayload = Omit<UserEntity, 'password'>;

export interface LogedinUser {
  userId: string;
  userName: string;
  roles: string | string[];
  userDI: string;
  nickName: string;
}

export interface LogedInExpressRequest extends Request {
  user: LogedinUser
}
