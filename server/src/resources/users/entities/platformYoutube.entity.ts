import { Entity, Column, OneToOne, } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'PlatformYoutube' })
export class PlatformYoutubeEntity {
  @OneToOne((type) => UserEntity, (user) => user.youtubeId)
  @Column({ primary: true })
  youtubeId!: string;

  @Column({ length: 200 })
  logo!: string;

  @Column({ nullable: false })
  refreshToken!: string;

  @Column()
  youtubeChannelName!: string;
}
