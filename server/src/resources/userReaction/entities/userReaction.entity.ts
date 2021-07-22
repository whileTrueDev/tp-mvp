import {
  BaseEntity,
  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn,
} from 'typeorm';
import { UserReaction } from '@truepoint/shared/dist/interfaces/UserReaction.interface';

@Entity({ name: 'UserReactionsTest2' })
export class UserReactionEntity extends BaseEntity implements UserReaction {
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

  @Column({ select: false, comment: 'bcrypt로 암호화된 비밀번호' })
  password: string;

  @Column({ nullable: true, default: null, comment: '작성자 userId, 관리자인 경우 Truepoint 로 저장한다' })
  userId: string;
}
