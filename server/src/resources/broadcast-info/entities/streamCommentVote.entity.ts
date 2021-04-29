import {
  Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, CreateDateColumn,
} from 'typeorm';
import { CreatorCommentVote } from '@truepoint/shared/interfaces/CreatorCommentVote.interface';
import { StreamCommentsEntity } from './streamComment.entity';

@Entity({ name: 'StreamCommentVoteTest' })
export class StreamCommentVoteEntity implements CreatorCommentVote {
  constructor(partial: Partial<StreamCommentVoteEntity>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => StreamCommentsEntity, (comment) => comment.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'commentId' })
  @Column()
  commentId: number;

  @Column()
  userIp: string;

  @Column({ nullable: true, comment: '추천한 유저 id' })
  userId: string;

  @Column({ comment: '추천 1, 비추천 0' })
  vote: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createDate: Date;
}
