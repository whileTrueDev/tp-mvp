import {
  Entity, Column, PrimaryColumn, OneToOne
} from 'typeorm';
import { StreamsEntity } from './streams.entity';

@Entity({ name: 'StreamSummary' })
export class StreamSummaryEntity {
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
