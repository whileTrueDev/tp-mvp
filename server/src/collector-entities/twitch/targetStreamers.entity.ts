import {
  Column, CreateDateColumn, Entity, UpdateDateColumn,
} from 'typeorm';

// collectors/twitchtv/src/model/member.py 참고하세요.
@Entity('TwitchTargetStreamers')
export class TwitchTargetStreamersEntity {
  @Column({ primary: true })
  streamerId: string;

  @Column()
  streamerName: string;

  @Column({ length: 100 })
  streamerChannelName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
