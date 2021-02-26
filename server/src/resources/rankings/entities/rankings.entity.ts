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

  @CreateDateColumn({ type: 'timestamp' })
  createDate: Date;

  @Column({ type: 'timestamp' })
  streamDate: Date;

  @Column({ type: 'mediumint', default: 0 })
  viewer: number;

  @Column({ type: 'smallint', default: 0 })
  smileScore: number;

  @Column({ type: 'smallint', default: 0 })
  frustrateScore: number;

  @Column({ type: 'smallint', default: 0 })
  admireScore: number;

  constructor(partial: Partial<RankingsEntity>) {
    Object.assign(this, partial);
  }
}
