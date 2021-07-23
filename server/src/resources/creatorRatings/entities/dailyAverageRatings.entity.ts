import {
  Entity, Column, PrimaryGeneratedColumn, Index,
} from 'typeorm';
import { DailyAverageRatings } from '@truepoint/shared/dist/interfaces/DailyAverageRatings.interface';

/**
 * 매일 방송인의 그 날 평균 평점을 저장하는 테이블
 * 그 날 평점이 매겨진 방송인에 대해서만 평점을 계산하여 저장함
 * 
 * 유저는 방송인에게 평점을 한 번만 매길 수 있다
 * 이미 매긴 평점을 변경하는 경우 과거 날짜의 평균 평점이 변경되어서 
 * 과거 날짜의 평균 평점을 스냅샷처럼 저장해두기 위해 이 테이블을 만듦
 */
@Entity({ name: 'DailyAverageRatings' })
@Index('DailyAverageRatings_creatorId_IDX', ['creatorId'])
export class DailyAverageRatingsEntity implements DailyAverageRatings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  creatorId: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'float', comment: '해당 크리에이터의 해당 날짜의 평균 평점(평점이 매겨진 날에만 기록함)' })
  averageRating: number;
}
