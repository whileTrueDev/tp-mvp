import {
  Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'Subscribe' })
export class SubscribeEntity {
  @PrimaryGeneratedColumn()
  index: number

  @ManyToOne((type) => UserEntity, (user) => user.subscribe)
  @JoinColumn({ name: 'userId' })
  user: UserEntity

  @Column({ length: 20 })
  targetUserId: string;

  @Column()
  startAt : Date;

  @Column()
  endAt : Date;
}
