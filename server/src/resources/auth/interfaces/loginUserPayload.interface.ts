import { UserEntity } from '../../users/entities/user.entity';

export type UserLoginPayload = Omit<UserEntity, 'password'>;

export interface LogedinUser {
  userId: string;
  userName: string;
}
