import {
  Entity, Column, PrimaryGeneratedColumn, ManyToOne
} from 'typeorm';

@Entity({ name: 'Notification' })
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  index: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  dateform: string;

  @Column()
  readState: number;
}
