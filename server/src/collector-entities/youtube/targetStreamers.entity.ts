import {
  Column, Entity,
} from 'typeorm';

@Entity('YoutubeTargetStreamers')
export class YoutubeTargetStreamersEntity {
  @Column({ primary: true })
  channelId: string;

  @Column({ nullable: true })
  channelName: string;

  @Column({ length: 150, nullable: true })
  refresh_token: string;
}
