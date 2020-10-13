import { UserToken } from '@truepoint/shared/dist/interfaces/UserToken.interface';
import {
  Entity, Column, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'UserTokens' })
export class UserTokenEntity implements UserToken {
  // For Exclude Decorator
  constructor(partial: Partial<UserTokenEntity>) {
    Object.assign(this, partial);
  }

  @Column({ primary: true })
  userId!: string

  @Column('text')
  refreshToken!: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
