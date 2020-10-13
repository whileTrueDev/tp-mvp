import { PlatformYoutube } from '@truepoint/shared/dist/interfaces/PlatformYoutube.interface';
import { Entity, Column, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'PlatformYoutube' })
export class PlatformYoutubeEntity implements PlatformYoutube {
  @OneToOne((type) => UserEntity, (user) => user.youtubeId)
  @Column({ primary: true })
  youtubeId!: string;

  @Column()
  logo!: string;

  @Column({ nullable: false })
  refreshToken!: string;

  @Column()
  youtubeChannelName!: string;
}
