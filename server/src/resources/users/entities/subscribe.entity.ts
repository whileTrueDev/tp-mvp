import {
  Entity, Column, PrimaryColumn
} from 'typeorm';

@Entity({ name: 'Subscribe' })
export class SubscribeEntity {
  @PrimaryColumn({ length: 20 })
  userId : string;

  @PrimaryColumn({ length: 20 })
  targetUserId: string;

  @Column()
  startAt : Date;

  @Column()
  endAt : Date;
}
