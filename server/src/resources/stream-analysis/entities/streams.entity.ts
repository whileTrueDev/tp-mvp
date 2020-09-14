import {
  Entity, Column, PrimaryColumn, OneToOne,
} from 'typeorm';
import { StreamSummaryEntity } from './streamSummary.entity';

@Entity({ name: 'Streams' })
export class StreamsEntity {
  @OneToOne((type) => StreamSummaryEntity, (StreamSummary) => StreamSummary.streamId)
  @PrimaryColumn()
  streamId: string;

  @PrimaryColumn()
  platform: string;

  @Column()
  userId: string;

  @Column()
  creatorId: string;

  @Column()
  title: string;

  @Column()
  viewer: number;

  @Column()
  fan: number;

  @Column('timestamp')
  startedAt: Date;

  @Column()
  airTime: number;

  @Column()
  chatCount: number;

  // @OneToOne((type) => StreamSummaryEntity, (streamSummary) => streamSummary.streams)
  // streamSummary: StreamSummaryEntity

  constructor(partial: Partial<StreamsEntity>) {
    Object.assign(this, partial);
  }
}
