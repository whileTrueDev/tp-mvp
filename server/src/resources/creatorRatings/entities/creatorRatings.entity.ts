import { CreatorRatings } from '@truepoint/shared/dist/interfaces/CreatorRatings.interface';
import {
  Entity, Column,
  CreateDateColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn, BaseEntity,
} from 'typeorm';

@Entity({ name: 'CreatorRatingsTest2' })
@Unique('UX_creatorId_userId', ['creatorId', 'userId'])
export class CreatorRatingsEntity extends BaseEntity implements CreatorRatings {
  constructor(partial: Partial<CreatorRatingsEntity>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '유저가 평점을 매긴 creatorId' })
  creatorId: string;

  @Column({ comment: '평점을 매긴 유저의 ip' })
  userIp: string;

  @Column({ nullable: true, comment: '평점을 매긴 유저의 id, 비회원도 평점을 매길 수 있다' })
  userId: string;

  @Column({ type: 'float', comment: '유저가 해당 creator에 매긴 평점, 0~5점, 0.5단위로 생성됨' })
  rating: number;

  @CreateDateColumn({ type: 'timestamp', comment: '생성 날짜' })
  createDate: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '수정 날짜' })
  updateDate: Date;

  @Column({ comment: '평점이 매겨진 creatorId의 플랫폼, afreeca | twitch' })
  platform: string;
}
