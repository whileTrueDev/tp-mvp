import { FeatureSuggestionReply } from '@truepoint/shared/dist/interfaces/FeatureSuggestionReply.interface';
import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { FeatureSuggestionEntity } from './featureSuggestion.entity';

@Entity({ name: 'FeatureSuggestionReplyTest2' })
export class FeatureSuggestionReplyEntity implements FeatureSuggestionReply {
  @PrimaryGeneratedColumn()
  replyId: number;

  @JoinColumn({ name: 'suggestionId' })
  @ManyToOne((type) => FeatureSuggestionEntity, (fs) => fs.replies)
  suggestionId: number;

  @Column()
  content: string;

  @JoinColumn({ name: 'author' })
  @ManyToOne((type) => UserEntity, (user) => user.userId)
  author: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  constructor(partial: Partial<FeatureSuggestionReplyEntity>) {
    Object.assign(this, partial);
  }
}
