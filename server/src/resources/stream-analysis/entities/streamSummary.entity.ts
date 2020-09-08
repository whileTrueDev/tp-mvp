import {
  Entity, Column, PrimaryColumn, OneToOne, JoinColumn
} from 'typeorm';
import { StreamsEntity } from './streams.entity';

@Entity({ name: 'StreamSummary' })
export class StreamSummaryEntity {
  @PrimaryColumn()
  streamId: string;

  @PrimaryColumn()
  platform: string;

  @Column()
  chatCount: number;

  @Column()
  smileCount: number;

  @Column('timestamp')
  createdAt: Date;

  // @OneToOne(() => StreamsEntity)
  // @JoinColumn()
  // streams: StreamsEntity

  constructor(partial: Partial<StreamSummaryEntity>) {
    Object.assign(this, partial);
  }
}
