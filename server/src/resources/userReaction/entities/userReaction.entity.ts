import {
  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn,
} from 'typeorm';
import { UserReaction } from '@truepoint/shared/dist/interfaces/UserReaction.interface';

@Entity({ name: 'UserReactionsTest' })
export class UserReactionEntity implements UserReaction {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  username: string;

  @Column()
  ip: string;

  @Column()
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  createDate: Date;
}
