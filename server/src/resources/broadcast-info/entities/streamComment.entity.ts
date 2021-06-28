import {
  Entity, Column,
  CreateDateColumn, PrimaryGeneratedColumn, OneToMany, Index, ManyToOne, JoinColumn, BaseEntity,
} from 'typeorm';
import { StreamComments } from '@truepoint/shared/dist/interfaces/StreamComments.interface';
import { StreamCommentVoteEntity } from './streamCommentVote.entity';
import { UserEntity } from '../../users/entities/user.entity';
// import { StreamsEntity } from './streams.entity';

@Entity({ name: 'StreamCommentTest' })
@Index('IX_streamId', ['streamId'])
export class StreamCommentsEntity extends BaseEntity implements StreamComments {
  constructor(partial: Partial<StreamCommentsEntity>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  commentId: number;

  @JoinColumn({ name: 'userId' })
  @ManyToOne((type) => UserEntity, (user) => user.streamComments, { nullable: true, onDelete: 'CASCADE' })
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

  @Column({ comment: '댓글이 달린 방송(stream) 아이디' })
  streamId: string;

  // @ManyToOne((type) => StreamsEntity, (stream) => stream.comments, { onDelete: 'CASCADE' })
  // @JoinColumn([
  //   { name: 'streamId', referencedColumnName: 'streamId' },
  // ])
  // stream: StreamsEntity;

  @ManyToOne((type) => StreamCommentsEntity, (comment) => comment.childrenComments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentCommentId', referencedColumnName: 'commentId' })
  @Column({ nullable: true, default: null, comment: '해당 값이 존재하는 경우 자식댓글(대댓글)이고, 해당 값이 null인 경우는 부모댓글. 부모 댓글의 commentId ' })
  parentCommentId: number;

  @OneToMany((type) => StreamCommentsEntity, (comment) => comment.parentCommentId)
  childrenComments?: StreamCommentsEntity[];

  @OneToMany((type) => StreamCommentVoteEntity, (vote) => vote.commentId)
  votes? : StreamCommentVoteEntity[];
}
