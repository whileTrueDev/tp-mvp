import {
  Entity, Column,
  CreateDateColumn, PrimaryGeneratedColumn, OneToMany,
} from 'typeorm';
import { CreatorComments } from '@truepoint/shared/interfaces/CreatorComments.interface';
import { CreatorCommentLikesEntity } from './creatorCommentLikes.entity';
import { CreatorCommentHatesEntity } from './creatorCommentHates.entity';
@Entity({ name: 'CreatorCommentsTest' })
export class CreatorCommentsEntity implements CreatorComments {
  constructor(partial: Partial<CreatorCommentsEntity>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  commentId: number;

  @Column({ comment: '댓글이 달린 크리에이터 아이디' })
  creatorId: string;

  @Column({ nullable: true, comment: '댓글을 단 userId' })
  userId: string;

  @Column({ length: 12, comment: '12자 제한' })
  nickname: string;

  @Column({ comment: '암호화된 비밀번호' })
  password: string;

  @Column()
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  createDate: Date;

  // likes
  @OneToMany((type) => CreatorCommentLikesEntity, (like) => like.commentId)
  likes? : CreatorCommentLikesEntity[];

  // hates
  @OneToMany((type) => CreatorCommentHatesEntity, (hate) => hate.commentId)
  hates? : CreatorCommentHatesEntity[];
}
