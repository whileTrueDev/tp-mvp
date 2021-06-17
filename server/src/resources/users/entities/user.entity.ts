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
import { CommunityPostEntity } from '../../communityBoard/entities/community-post.entity';
import { CommunityReplyEntity } from '../../communityBoard/entities/community-reply.entity';
import { CreatorCommentsEntity } from '../../creatorComment/entities/creatorComment.entity';
import { StreamCommentsEntity } from '../../broadcast-info/entities/streamComment.entity';
import { FeatureSuggestionEntity } from '../../featureSuggestion/entities/featureSuggestion.entity';
import { FeatureSuggestionReplyEntity } from '../../featureSuggestion/entities/featureSuggestionReply.entity';

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

  @Column({ length: 50, comment: '이메일주소' })
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
  @JoinColumn({ name: 'youtubeId' })
  youtube?: PlatformYoutubeEntity;

  @OneToOne(() => PlatformTwitchEntity, (platformTwitch) => platformTwitch.twitchId, { nullable: true })
  @JoinColumn({ name: 'twitchId' })
  twitch?: PlatformTwitchEntity;

  @OneToOne(() => PlatformAfreecaEntity, (platformAfreeca) => platformAfreeca.afreecaId, { nullable: true })
  @JoinColumn({ name: 'afreecaId' })
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

  @Column({ default: 'local', comment: 'sns 로그인시 해당 플랫폼(kakao, naver ...), 트루포인트 회원은 local' })
  provider: string;

  @Column({ nullable: true, comment: '네이버 로그인으로 가입된 회원의 naver 회원번호' })
  naverId?: string;

  @Column({ nullable: true, comment: '카카오 로그인으로 가입된 회원의 kakao 회원번호' })
  kakaoId?: string;

  @OneToMany((type) => CommunityPostEntity, (post) => post.author)
  communityPosts? : CommunityPostEntity[];

  @OneToMany((type) => CommunityReplyEntity, (post) => post.userId)
  communityReplies? : CommunityReplyEntity[];

  @OneToMany((type) => CreatorCommentsEntity, (post) => post.userId)
  creatorComments?: CreatorCommentsEntity[];

  @OneToMany((type) => StreamCommentsEntity, (post) => post.userId)
  streamComments?: StreamCommentsEntity[];

  @OneToMany((type) => FeatureSuggestionEntity, (post) => post.author)
  featureSuggestions?: FeatureSuggestionEntity[];

  @OneToMany((type) => FeatureSuggestionReplyEntity, (post) => post.author)
  featureSuggestionReplies?: FeatureSuggestionReplyEntity[];
}
