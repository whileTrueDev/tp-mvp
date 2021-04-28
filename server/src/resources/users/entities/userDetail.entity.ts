import { UserDetail } from '@truepoint/shared/dist/interfaces/UserDetail.interface';
import {
  Entity, Column, OneToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'UserDetail' })
export class UserDetailEntity implements UserDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, (user) => user.detail)
  user?: UserEntity;

  @Column({ comment: '방송인 설명', nullable: true })
  description?: string;

  @Column({ comment: '방송인 Light 대문 이미지 주소 ', nullable: true })
  heroImageLight?: string;

  @Column({ comment: '방송인 Dark 대문 이미지 주소', nullable: true })
  heroImageDark?: string;

  @Column({ comment: '유튜브 채널 주소', nullable: true })
  youtubeChannelAddress?: string;
}
