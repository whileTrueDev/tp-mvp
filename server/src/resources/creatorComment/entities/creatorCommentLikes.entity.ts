import {
  Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Unique,
} from 'typeorm';
import { CreatorCommentLikes } from '@truepoint/shared/interfaces/CreatorCommentLikes.interface';
import { CreatorCommentsEntity } from './creatorComment.entity';
@Entity({ name: 'CreatorCommentLikesTest' })
@Unique('UX_like', ['userIp', 'commentId']) // ip당 같은 코멘트에 1번만
export class CreatorCommentLikesEntity implements CreatorCommentLikes {
  constructor(partial: Partial<CreatorCommentsEntity>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => CreatorCommentsEntity, (comment) => comment.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'commentId' })
  @Column()
  commentId: number;

  @Column()
  userIp: string;

  @Column({ nullable: true, comment: '추천한 유저 id' })
  userId: string;
}
