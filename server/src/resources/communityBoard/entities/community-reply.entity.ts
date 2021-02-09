import { CommunityReply } from '@truepoint/shared/dist/interfaces/CommunityReply.interface';
import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { CommunityPostEntity } from './community-post.entity';

@Entity({ name: 'CommunityReplyTest' })
export class CommunityReplyEntity implements CommunityReply {
  @PrimaryGeneratedColumn({ type: 'int' })
  replyId: number;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ type: 'varchar', length: 20 })
  nickname: string;

  @Column({ type: 'varchar', length: 20 })
  ip: string;

  @Column({ type: 'varchar' })
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createDate: Date;

  @ManyToOne((type) => CommunityPostEntity, (post) => post.replies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  postId: number;
}
