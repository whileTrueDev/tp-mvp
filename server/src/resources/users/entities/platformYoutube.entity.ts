import { PlatformYoutube } from '@truepoint/shared/dist/interfaces/PlatformYoutube.interface';
import {
  Entity, Column, CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  Index,
  OneToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'PlatformYoutube' })
export class PlatformYoutubeEntity implements PlatformYoutube {
  // **************************************
  // 구글 아이디 연동 정보
  @Column()
  @Index({ unique: true })
  googleId!: string;

  @Column({ comment: '구글 displayName' })
  googleName: string;

  @Column()
  googleEmail: string;

  @Column({ comment: '"{size}"는 s80, s240, s800 으로 치환' })
  googleLogo!: string;

  // *****************************************
  // youtube 정보
  @PrimaryColumn()
  youtubeId!: string;

  @Column()
  youtubeTitle!: string;

  @Column({ comment: '"{size}"는 s80, s240, s800 으로 치환' })
  youtubeLogo!: string;
  // "https://yt3.ggpht.com/a/AATXAJymTRnCPcarFGQqQKb557x7e0QD_w8d4g1S=s{사이즈를 나타내는 숫자 80,240,800}-c-k-c0x00ffffff-no-rj",

  @Column({ nullable: false })
  refreshToken!: string;

  @Column({ type: 'timestamp' })
  youtubePublishedAt: Date;

  @OneToOne(() => UserEntity, (user) => user.youtube)
  user?: UserEntity;

  @CreateDateColumn({ type: 'timestamp', comment: '첫 연동 날짜' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '연동 정보 최신화 날짜' })
  updatedAt?: Date;
}
