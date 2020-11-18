import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import {
  Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';

// Related Entities
import { SubscribeEntity } from './subscribe.entity';
import { NotificationEntity } from '../../notification/entities/notification.entity';

@Entity({ name: 'UserTest2' })
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
  birth!: string;

  @Column({ length: 1 })
  gender!: string;

  @Column()
  marketingAgreement: boolean;

  @Column({ default: 'user', comment: '유저 역할(관리자,유저,...)' })
  roles?: string;

  @Column({ comment: '대표 프로필 사진' })
  profileImage?: string;

  @Column({ nullable: true, default: null })
  twitchId?: string | null;

  @Column({ nullable: true, default: null })
  afreecaId?: string | null;

  @Column({ nullable: true, default: null })
  youtubeId?: string | null;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @OneToMany((type) => SubscribeEntity, (subscribe) => subscribe.user)
  subscribe? : SubscribeEntity[];

  @OneToMany((type) => NotificationEntity, (notification) => notification.user)
  notification? : NotificationEntity[];
}
