import { FeatureSuggestion } from '@truepoint/shared/dist/interfaces/FeatureSuggestion.interface';

import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne, JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { FeatureSuggestionReplyEntity } from './featureSuggestionReply.entity';

@Entity({ name: 'FeatureSuggestionTest' })
export class FeatureSuggestionEntity implements FeatureSuggestion {
  @PrimaryGeneratedColumn()
  suggestionId: number;

  @Column({ type: 'varchar', length: 50 })
  category: string;

  @Column()
  title: string;

  @Column({ type: 'longtext' })
  content: string;

  @JoinColumn({ name: 'author' })
  @ManyToOne((type) => UserEntity, (user) => user.featureSuggestions, { nullable: true, onDelete: 'CASCADE' })
  author: UserEntity;

  @Column({ comment: '작성자 Ip' })
  userIp: string;

  @Column({ type: 'varchar', select: false, comment: '암호화된 비밀번호' })
  password: string;

  @Column({
    type: 'tinyint', default: 0, comment: '기능제안 상태 플래그 0=미확인, 1=검토중 2=개발확정, 3=개발보류',
  })
  state: number;

  @Column({ type: 'smallint', unsigned: true, default: 0 })
  like: number;

  @Column({ comment: '비밀글 여부 0=비밀글X, 1=비밀글O', default: false })
  isLock: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // 기능제안 답장. 관계설정
  @OneToMany((type) => FeatureSuggestionReplyEntity, (reply) => reply.suggestionId)
  replies? : FeatureSuggestionReplyEntity[];

  constructor(partial: Partial<FeatureSuggestionEntity>) {
    Object.assign(this, partial);
  }
}
