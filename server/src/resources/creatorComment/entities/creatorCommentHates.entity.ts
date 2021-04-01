import {
  Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne,
} from 'typeorm';
import { CreatorCommentLikes } from '@truepoint/shared/interfaces/CreatorCommentLikes.interface';
import { CreatorCommentsEntity } from './creatorComment.entity';
@Entity({ name: 'CreatorCommentHatesTest' })
export class CreatorCommentHatesEntity implements CreatorCommentLikes {
  constructor(partial: Partial<CreatorCommentsEntity>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => CreatorCommentsEntity, (comment) => comment.hates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'commentId' })
  commentId: number;

  @Column()
  userIp: string;

  @Column({ nullable: true, comment: '추천한 유저 id' })
  userId: string;
}
