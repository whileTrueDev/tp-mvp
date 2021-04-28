import { CommunityReply } from '@truepoint/shared/dist/interfaces/CommunityReply.interface';
import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany,
} from 'typeorm';
import { CommunityPostEntity } from './community-post.entity';

@Entity({ name: 'CommunityReplyTest1' })
export class CommunityReplyEntity implements CommunityReply {
  @PrimaryGeneratedColumn({ type: 'int' })
  replyId: number;

  @Column({ nullable: true, comment: '댓글을 단 사용자의 userId' })
  userId: string;

  @Column({ type: 'varchar', length: 12, comment: '12자 제한' })
  nickname: string;

  @Column({ type: 'varchar', length: 100, comment: '100자 제한' })
  content: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createDate: Date;

  @Column({ default: false, comment: '삭제여부' })
  deleteFlag: boolean;

  @Column({ default: 0, comment: '신고 누적 횟수' })
  reportCount: number;

  @Column({ type: 'varchar', length: 20 })
  ip: string;

  @ManyToOne((type) => CommunityPostEntity, (post) => post.replies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  @Column(({ comment: '댓글이 달린 글의 id' }))
  postId: number;

  @ManyToOne((type) => CommunityReplyEntity)
  @JoinColumn({ name: 'parentReplyId', referencedColumnName: 'replyId' })
  @Column({ nullable: true, default: null, comment: '해당 값이 존재하는 경우 자식댓글(대댓글)이고, 해당 값이 null인 경우는 부모댓글. 부모 댓글의 id ' })
  parentReplyId: number;

  @OneToMany((type) => CommunityReplyEntity, (comment) => comment.parentReplyId)
  childrenComments?: CommunityReplyEntity[];
}
