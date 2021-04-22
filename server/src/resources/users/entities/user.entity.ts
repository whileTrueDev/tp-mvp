import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import {
  Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

// Related Entities
import { SubscribeEntity } from './subscribe.entity';
import { NotificationEntity } from '../../notification/entities/notification.entity';
import { PlatformYoutubeEntity } from './platformYoutube.entity';
import { PlatformTwitchEntity } from './platformTwitch.entity';
import { PlatformAfreecaEntity } from './platformAfreeca.entity';
import { UserDetailEntity } from './userDetail.entity';

@Entity({ name: 'UserTest' })
export class UserEntity implements User {
  // For Exclude Decorator
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @Column({ primary: true, length: 20 })
  userId!: string

  @Column({ length: 30 })
  nickName!: string;

  @Column({ nullable: false, length: 15 })
  name!: string;

  @Column({ length: 50 })
  mail!: string;

  @Column({ length: 50 })
  phone!: string;

  @Column({ length: 70, unique: true })
  userDI?: string;

  @Exclude()
  @Column({ nullable: false })
  password!: string;

  @Column({ length: 10 })
  birth: string;

  @Column({ length: 1 })
  gender: string;

  @Column()
  marketingAgreement: boolean;

  @Column({ default: 'user', comment: '유저 역할(관리자,유저,...)', nullable: true })
  roles?: string;

  @Column({ type: 'text', comment: '대표 프로필 사진', nullable: true })
  profileImage?: string;

  @OneToOne(() => PlatformYoutubeEntity, (platformYoutube) => platformYoutube.youtubeId, { nullable: true })
  @JoinColumn()
  youtube?: PlatformYoutubeEntity;

  @OneToOne(() => PlatformTwitchEntity, (platformTwitch) => platformTwitch.twitchId, { nullable: true })
  @JoinColumn()
  twitch?: PlatformTwitchEntity;

  @OneToOne(() => PlatformAfreecaEntity, (platformAfreeca) => platformAfreeca.afreecaId, { nullable: true })
  @JoinColumn()
  afreeca?: PlatformAfreecaEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;

  @OneToMany((type) => SubscribeEntity, (subscribe) => subscribe.user)
  subscribe? : SubscribeEntity[];

  @OneToMany((type) => NotificationEntity, (notification) => notification.user)
  notification? : NotificationEntity[];

  @OneToOne(() => UserDetailEntity, (detail) => detail.user)
  @JoinColumn()
  detail?: UserDetailEntity;
}
