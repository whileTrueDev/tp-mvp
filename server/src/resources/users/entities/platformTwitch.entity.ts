import { PlatformTwitch } from '@truepoint/shared/dist/interfaces/PlatformTwitch.interface';
import {
  Entity, Column, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'PlatformTwitchTest' })
export class PlatformTwitchEntity implements PlatformTwitch {
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

  @Column()
  refreshToken!: string;

  @CreateDateColumn({ comment: '첫 연동 날짜' })
  createdAt?: Date;

  @UpdateDateColumn({ comment: '연동 정보 최신화 날짜' })
  updatedAt?: Date;
}
