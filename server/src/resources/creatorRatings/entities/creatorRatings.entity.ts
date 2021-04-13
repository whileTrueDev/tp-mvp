import { CreatorRatings } from '@truepoint/shared/dist/interfaces/CreatorRatings.interface';
import {
  Entity, Column,
  CreateDateColumn, PrimaryGeneratedColumn, Unique,
} from 'typeorm';

@Entity({ name: 'CreatorRatings' })
@Unique('UX_creatorId_userIp', ['creatorId', 'userIp'])
export class CreatorRatingsEntity implements CreatorRatings {
  constructor(partial: Partial<CreatorRatingsEntity>) {
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

  @Column({ comment: '유저가 해당 creator에 매긴 평점, 0~10' })
  rating: number;

  @CreateDateColumn({ type: 'timestamp', comment: '생성 날짜' })
  createDate: Date;
}
