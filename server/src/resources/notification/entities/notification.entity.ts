import { Notification } from '@truepoint/shared/dist/interfaces/Notification.interface';
import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn,
} from 'typeorm';

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

  constructor(partial: Partial<NotificationEntity>) {
    Object.assign(this, partial);
  }
}
