import {
  Entity, Column, PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'Notification' })
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  index: number;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column('timestamp')
  dateform: string;

  @Column()
  readState: number;

  constructor(partial: Partial<NotificationEntity>) {
    Object.assign(this, partial);
  }
}
