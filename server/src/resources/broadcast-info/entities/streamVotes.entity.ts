import {
  Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne,
} from 'typeorm';
import { StreamsEntity } from './streams.entity';

@Entity({ name: 'StreamVotes' })
export class StreamVotesEntity {
  constructor(partial: Partial<StreamVotesEntity>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => StreamsEntity, (stream) => stream.votes, { onDelete: 'CASCADE' })
  stream: StreamsEntity;

  @Column({ comment: '유저반응 (좋아요=1싫어요=0)' })
  vote: boolean;

  @Column({ comment: '추천자 IP주소' })
  userIp: string;

  @Column({ nullable: true, comment: '추천한 유저 ID' })
  userId?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createDate?: Date;
}
