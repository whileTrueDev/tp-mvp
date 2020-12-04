import {
  Entity, Column, PrimaryColumn,
} from 'typeorm';
import { StreamsTest2 } from '@truepoint/shared/dist/interfaces/StreamsTest2.interface';

@Entity({ name: 'Streams_test_2' })
export class StreamsTest2Entity implements StreamsTest2 {
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

  constructor(partial: Partial<StreamsTest2Entity>) {
    Object.assign(this, partial);
  }
}
