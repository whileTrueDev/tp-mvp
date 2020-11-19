import { FeatureSuggestion } from '@truepoint/shared/dist/interfaces/FeatureSuggestion.interface';

import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany,
} from 'typeorm';
import { FeatureSuggestionReplyEntity } from './featureSuggestionReply.entity';

@Entity({ name: 'FeatureSuggestionTest' })
export class FeatureSuggestionEntity implements FeatureSuggestion {
  @PrimaryGeneratedColumn()
  suggestionId: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  category: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  author: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  userId: string;

  @Column({ type: 'tinyint', default: 0, comment: '기능제안 상태 플래그 0=미확인, 1=승인, 2=보류' })
  state: number;

  @Column({ type: 'smallint', default: 0 })
  like: number;

  @Column({ comment: '비밀글 여부 0=비밀글X, 1=비밀글O', default: false })
  isLock: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // 기능제안 답장. 관계설정
  @OneToMany((type) => FeatureSuggestionReplyEntity, (reply) => reply.suggestionId)
  replies? : FeatureSuggestionReplyEntity[];

  constructor(partial: Partial<FeatureSuggestionEntity>) {
    Object.assign(this, partial);
  }
}
