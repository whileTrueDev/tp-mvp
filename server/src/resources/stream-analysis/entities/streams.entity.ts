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

  @Column()
  viewer: number;

  @Column()
  fan: number;

  @Column('timestamp')
  startDate: Date;

  @Column('timestamp')
  endDate: Date;

  @Column()
  airTime: number;

  @Column()
  chatCount: number;

  @Column()
  needAnalysis: boolean;

  constructor(partial: Partial<StreamsEntity>) {
    Object.assign(this, partial);
  }
}
