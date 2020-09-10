import {
  Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, OneToOne, JoinColumn
} from 'typeorm';
import { StreamSummaryEntity } from './streamSummary.entity';

@Entity({ name: 'Streams' })
export class StreamsEntity {
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
  startAt: Date;

  @Column()
  length: number;

  // @OneToOne((type) => StreamSummaryEntity, (streamSummary) => streamSummary.streams)
  // streamSummary: StreamSummaryEntity

  constructor(partial: Partial<StreamsEntity>) {
    Object.assign(this, partial);
  }
}
