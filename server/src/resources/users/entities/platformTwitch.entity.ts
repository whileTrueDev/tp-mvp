import { Entity, Column, OneToOne, } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'PlatformTwitch' })
export class PlatformTwitchEntity {
  @OneToOne((type) => UserEntity, (user) => user.twitchId)
  @Column({ primary: true })
  twitchId!: string;

  @Column()
  logo!: string;

  // ex) 침착맨
  @Column()
  twitchStreamerName!: string;

  // ex) zilioner
  @Column()
  twitchChannelName!: string;
}
