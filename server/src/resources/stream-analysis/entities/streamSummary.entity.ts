import {
  Entity, Column, PrimaryColumn, OneToOne,
} from 'typeorm';
import { StreamSummary } from '@truepoint/shared/dist/interfaces/StreamSummary.interface';
import { StreamsEntity } from './streams.entity';

@Entity({ name: 'StreamSummary' })
export class StreamSummaryEntity implements StreamSummary {
  @OneToOne((type) => StreamsEntity, (Streams) => Streams.streamId)
  @PrimaryColumn()
  streamId: string;

  @PrimaryColumn()
  platform: string;

  @Column()
  smileCount: number;

  @Column('timestamp')
  createdAt: Date;

  // @OneToOne((type) => StreamsEntity, (streams) => streams.streamSummary)
  // streams: StreamsEntity

  constructor(partial: Partial<StreamSummaryEntity>) {
    Object.assign(this, partial);
  }
}
