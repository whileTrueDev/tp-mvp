import {
  Entity, Column, PrimaryGeneratedColumn
} from 'typeorm';

@Entity({ name: 'Subscribe' })
export class SubscribeEntity {
  @PrimaryGeneratedColumn()
  index: number;

  @Column({ length: 20 })
  userId : string;

  @Column({ length: 20 })
  targetUserId: string;

  @Column()
  startAt : Date;

  @Column()
  endAt : Date;
}
