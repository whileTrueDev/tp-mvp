import {
  Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, CreateDateColumn,
} from 'typeorm';
import { CreatorCommentVote } from '@truepoint/shared/interfaces/CreatorCommentVote.interface';
import { CreatorCommentsEntity } from './creatorComment.entity';

@Entity({ name: 'CreatorCommentVoteTest' })
// @Unique('UX_like', ['userIp', 'commentId']) // ip당 같은 코멘트에 1번만
export class CreatorCommentVoteEntity implements CreatorCommentVote {
  constructor(partial: Partial<CreatorCommentVoteEntity>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => CreatorCommentsEntity, (comment) => comment.votes, { onDelete: 'CASCADE' })
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
