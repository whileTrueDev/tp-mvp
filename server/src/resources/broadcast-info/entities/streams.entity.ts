import {
  Entity, Column, PrimaryColumn, BaseEntity,
} from 'typeorm';
import { Stream } from '@truepoint/shared/dist/interfaces/Stream.interface';

@Entity({ name: 'Streams' })
export class StreamsEntity extends BaseEntity implements Stream {
  @PrimaryColumn()
  streamId: string;

  @PrimaryColumn({ comment: '방송플랫폼 (Twitch,Afreeca,...)' })
  platform: string;

  @Column({ comment: '방송인의 TP 아이디' })
  userId: string;

  @Column({ comment: '방송인의 아프리카/트위치 ID' })
  creatorId: string;

  @Column({ comment: '방송 제목' })
  title: string;

  @Column({ type: 'mediumint', default: 0, comment: '방송의 평균 시청자 수' })
  viewer: number;

  @Column({ type: 'mediumint', default: 0, comment: '방송이 끝난 시점의 팔로워(즐겨찾기) 수' })
  fan: number;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'float', comment: '방송 시간' })
  airTime: number;

  @Column({ type: 'mediumint', default: 0 })
  chatCount: number;

  @Column({ type: 'boolean', default: 1 })
  needAnalysis: boolean;

  constructor(partial: Partial<StreamsEntity>) {
    super();
    Object.assign(this, partial);
  }
}
