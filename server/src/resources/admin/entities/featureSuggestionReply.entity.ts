import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn
} from 'typeorm';

@Entity({ name: 'FeatureSuggestionReplyTest' })
export class FeatureSuggestionReplyEntity {
  @PrimaryGeneratedColumn()
  replyId: number;

  @Column()
  suggestionId: number;

  @Column()
  content: string;

  @Column({
    type: 'varchar',
    length: 50
  })
  author: string;

  @Column({
    type: 'varchar',
    length: 20
  })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  constructor(partial: Partial<FeatureSuggestionReplyEntity>) {
    Object.assign(this, partial);
  }
}
