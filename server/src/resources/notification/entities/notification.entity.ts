import { Notification } from '@truepoint/shared/dist/interfaces/Notification.interface';
import {
  Entity, Column, PrimaryGeneratedColumn,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';

import { UserEntity } from '../../users/entities/user.entity';

@Entity({ name: 'Notification' })
export class NotificationEntity implements Notification {
  @PrimaryGeneratedColumn()
  index: number;

  @Column({
    type: 'varchar',
    length: 20,
  })
  userId: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ type: 'boolean', default: 0 })
  readState: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne((type) => UserEntity, (user) => user.notification)
  @JoinColumn({ name: 'userId' })
  user: UserEntity

  constructor(partial: Partial<NotificationEntity>) {
    Object.assign(this, partial);
  }
}
