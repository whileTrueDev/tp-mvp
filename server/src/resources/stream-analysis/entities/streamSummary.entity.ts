import {
  Entity, Column, PrimaryColumn,
} from 'typeorm';
import { StreamSummary } from '@truepoint/shared/dist/interfaces/StreamSummary.interface';

@Entity({ name: 'StreamSummaryTest2' })
export class StreamSummaryEntity implements StreamSummary {
  @PrimaryColumn()
  streamId: string;

  @PrimaryColumn()
  platform: string;

  @Column()
  creatorId: string;

  @Column()
  smileCount: number;

  @Column('timestamp')
  createdAt: Date;

  constructor(partial: Partial<StreamSummaryEntity>) {
    Object.assign(this, partial);
  }
}
