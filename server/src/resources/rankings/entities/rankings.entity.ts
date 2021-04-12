import { Rankings } from '@truepoint/shared/interfaces/Rankings.interface';
import {
  Entity, Column,
  CreateDateColumn, PrimaryGeneratedColumn, Index,
} from 'typeorm';

@Entity({ name: 'Rankings' })
@Index('IX_creatorId_createDate', ['creatorId', 'createDate'])
export class RankingsEntity implements Rankings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  creatorId: string;

  @Column()
  platform: string;

  @Column()
  creatorName: string;

  @Column()
  title: string;

  @CreateDateColumn({ type: 'timestamp', comment: '테이블에 삽입된 날짜' })
  @Column()
  createDate: Date;

  @Column({ type: 'timestamp', comment: '방송이 종료된 날짜' })
  streamDate: Date;

  @Column({ type: 'mediumint', default: 0, comment: '시청자 수' })
  viewer: number;

  @Column({ type: 'float', default: 0, comment: '웃음 점수' })
  smileScore: number;

  @Column({ type: 'float', default: 0, comment: '답답함 점수' })
  frustrateScore: number;

  @Column({ type: 'float', default: 0, comment: '감탄 점수' })
  admireScore: number;

  @Column({ type: 'float', default: 0, comment: '욕설 점수' })
  cussScore: number;

  constructor(partial: Partial<RankingsEntity>) {
    Object.assign(this, partial);
  }
}
