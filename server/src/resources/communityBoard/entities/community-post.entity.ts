import { CommunityPost } from '@truepoint/shared/dist/interfaces/CommunityPost.interface';
import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne, BaseEntity,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CommunityReplyEntity } from './community-reply.entity';

@Entity({ name: 'CommunityPostTest1' })
export class CommunityPostEntity extends BaseEntity implements CommunityPost {
  @PrimaryGeneratedColumn({ type: 'int' })
  postId: number;

  @Column({ type: 'varchar', length: 20, comment: '20자 제한' })
  title: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ type: 'varchar', length: 12, comment: '12자 제한' })
  nickname: string;

  @Column({ type: 'varchar', length: 20 })
  ip: string;

  @Column({ type: 'varchar', select: false, comment: '암호화된 비밀번호' })
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createDate: Date;

  @Column({ type: 'tinyint', nullable: false, comment: '아프리카=0, 트위치=1, 자유게시판=2 플랫폼 구분용 컬럼' })
  platform: number;

  @Column({ type: 'tinyint', default: 0, comment: '일반글=0, 공지글=1 일반글,공지글 구분용 컬럼' })
  category: number;

  @Column({ type: 'int', default: 0 })
  hit: number;

  @Column({ type: 'int', default: 0, comment: '추천수' })
  recommend: number;

  @Column({ type: 'int', default: 0, comment: '비추천 수' })
  notRecommendCount: number;

  @OneToMany((type) => CommunityReplyEntity, (reply) => reply.post)
  replies? : CommunityReplyEntity[];

  @Column({ nullable: true, comment: '글 작성자 userId, 비회원의 글은 null값 저장' })
  userId: string;

  // @JoinColumn({ name: 'userId' })
  @ManyToOne((type) => UserEntity, (user) => user.communityPosts, { nullable: true, onDelete: 'CASCADE' })
  author?: UserEntity;
}
