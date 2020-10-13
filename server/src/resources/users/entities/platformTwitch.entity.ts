import { PlatformTwitch } from '@truepoint/shared/dist/interfaces/PlatformTwitch.interface';
import { Entity, Column, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'PlatformTwitch' })
export class PlatformTwitchEntity implements PlatformTwitch {
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
