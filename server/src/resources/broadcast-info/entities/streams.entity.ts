import {
  Entity, Column, PrimaryColumn,
} from 'typeorm';
import { Stream } from '@truepoint/shared/dist/interfaces/Stream.interface';

@Entity({ name: 'Streams_test_2' })
export class StreamsEntity implements Stream {
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

  @Column({ type: 'mediumint', default: 0 })
  viewer: number;

  @Column({ type: 'mediumint', default: 0 })
  fan: number;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'float' })
  airTime: number;

  @Column({ type: 'mediumint', default: 0 })
  chatCount: number;

  @Column({ type: 'boolean', default: 1 })
  needAnalysis: boolean;

  constructor(partial: Partial<StreamsEntity>) {
    Object.assign(this, partial);
  }
}
