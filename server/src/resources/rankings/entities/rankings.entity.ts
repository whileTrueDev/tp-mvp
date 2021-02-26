import { Rankings } from '@truepoint/shared/interfaces/Rankings.interface';
import {
  Entity, Column,
  CreateDateColumn, PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'Rankings' })
export class RankingsEntity implements Rankings {
  @PrimaryColumn()
  creatorId: string;

  @PrimaryColumn()
  platform: string;

  @Column()
  creatorName: string;

  @CreateDateColumn({ type: 'timestamp', comment: '테이블에 삽입된 날짜' })
  createDate: Date;

  @Column({ type: 'timestamp', comment: '방송이 종료된 날짜' })
  streamDate: Date;

  @Column({ type: 'mediumint', default: 0, comment: '시청자 수' })
  viewer: number;

  @Column({ type: 'smallint', default: 0, comment: '웃음 점수' })
  smileScore: number;

  @Column({ type: 'smallint', default: 0, comment: '답답함 점수' })
  frustrateScore: number;

  @Column({ type: 'smallint', default: 0, comment: '감탄 점수' })
  admireScore: number;

  constructor(partial: Partial<RankingsEntity>) {
    Object.assign(this, partial);
  }
}
