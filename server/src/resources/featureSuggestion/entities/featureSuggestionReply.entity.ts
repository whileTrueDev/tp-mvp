import { FeatureSuggestionReply } from '@truepoint/shared/dist/interfaces/FeatureSuggestionReply.interface';
import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { FeatureSuggestionEntity } from './featureSuggestion.entity';

@Entity({ name: 'FeatureSuggestionReplyTest' })
export class FeatureSuggestionReplyEntity implements FeatureSuggestionReply {
  @PrimaryGeneratedColumn()
  replyId: number;

  @JoinColumn({ name: 'suggestionId' })
  @ManyToOne((type) => FeatureSuggestionEntity, (fs) => fs.replies)
  suggestionId: number;

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

  @CreateDateColumn()
  createdAt: Date;

  constructor(partial: Partial<FeatureSuggestionReplyEntity>) {
    Object.assign(this, partial);
  }
}
