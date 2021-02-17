import { CommunityPost } from '@truepoint/shared/dist/interfaces/CommunityPost.interface';
import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, Index,
} from 'typeorm';
import { CommunityReplyEntity } from './community-reply.entity';

@Entity({ name: 'CommunityPostTest1' })
export class CommunityPostEntity implements CommunityPost {
  @PrimaryGeneratedColumn({ type: 'int' })
  postId: number;

  @Index({ fulltext: true })
  @Column({ type: 'varchar', length: 20, comment: '20자 제한' })
  title: string;

  @Index({ fulltext: true })
  @Column({ type: 'longtext' })
  content: string;

  @Index({ fulltext: true })
  @Column({ type: 'varchar', length: 12, comment: '12자 제한' })
  nickname: string;

  @Column({ type: 'varchar', length: 20 })
  ip: string;

  @Column({ type: 'varchar', select: false, comment: '암호화된 비밀번호' })
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createDate: Date;

  @Column({ type: 'tinyint', nullable: false, comment: '아프리카=0, 트위치=1 플랫폼 구분용 컬럼' })
  platform: number;

  @Column({ type: 'tinyint', default: 0, comment: '일반글=0, 공지글=1 일반글,공지글 구분용 컬럼' })
  category: number;

  @Column({ type: 'int', default: 0 })
  hit: number;

  @Column({ type: 'int', default: 0 })
  recommend: number;

  @OneToMany((type) => CommunityReplyEntity, (reply) => reply.postId)
  replies? : CommunityReplyEntity[];
}
