import { CreatorRatings } from '@truepoint/shared/dist/interfaces/CreatorRatings.interface';
import {
  Entity, Column,
  CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'CreatorRatings' })
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

  @CreateDateColumn({ type: 'timestamp', comment: '최초 생성 날짜' })
  createDate: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '수정된 날짜 - 수정일 기준으로 주간평점 가져온다' })
  updateDate: Date;
}
