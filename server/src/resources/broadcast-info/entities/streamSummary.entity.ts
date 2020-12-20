import {
  Entity, Column, PrimaryColumn, CreateDateColumn,
} from 'typeorm';
import { StreamSummary } from '@truepoint/shared/dist/interfaces/StreamSummary.interface';

@Entity({ name: 'StreamSummary' })
export class StreamSummaryEntity implements StreamSummary {
  @PrimaryColumn()
  streamId: string;

  @PrimaryColumn()
  platform: string;

  @Column({ type: 'mediumint', default: 0 })
  smileCount: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  constructor(partial: Partial<StreamSummaryEntity>) {
    Object.assign(this, partial);
  }
}
