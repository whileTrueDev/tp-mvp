import {
  Entity, Column,
  CreateDateColumn, PrimaryGeneratedColumn, OneToMany, Index, ManyToOne, JoinColumn,
} from 'typeorm';
import { CreatorComments } from '@truepoint/shared/interfaces/CreatorComments.interface';
import { CreatorCommentVoteEntity } from './creatorCommentVote.entity';
@Entity({ name: 'CreatorCommentsTest2' })
@Index('IX_creatorId', ['creatorId'])
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

  @Column({ select: false, comment: '암호화된 비밀번호' })
  password: string;

  @Column()
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  createDate: Date;

  @Column({ default: false, comment: '삭제여부' })
  deleteFlag: boolean;

  @Column({ default: 0, comment: '신고 누적 횟수' })
  reportCount: number;

  @ManyToOne((type) => CreatorCommentsEntity)
  @JoinColumn({ name: 'parentCommentId', referencedColumnName: 'commentId' })
  @Column({ nullable: true, default: null, comment: '해당 값이 존재하는 경우 자식댓글(대댓글)이고, 해당 값이 null인 경우는 부모댓글. 부모 댓글의 commentId ' })
  parentCommentId: number;

  @OneToMany((type) => CreatorCommentsEntity, (comment) => comment.parentCommentId)
  childrenComments?: CreatorCommentsEntity[];

  @OneToMany((type) => CreatorCommentVoteEntity, (vote) => vote.commentId)
  votes? : CreatorCommentVoteEntity[];
}
