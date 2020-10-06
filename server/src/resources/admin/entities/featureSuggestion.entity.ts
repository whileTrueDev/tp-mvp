import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn
} from 'typeorm';

@Entity({ name: 'FeatureSuggestionTest' })
export class FeatureSuggestionEntity {
  @PrimaryGeneratedColumn()
  suggestionId: number;

  @Column({
    type: 'varchar',
    length: 50
  })
  category: string;

  @Column()
  title: string;

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

  @Column({ type: 'tinyint', default: 0 })
  state: number;

  @Column({ type: 'smallint', default: 0 })
  like: number;

  @CreateDateColumn()
  createdAt: Date;

  constructor(partial: Partial<FeatureSuggestionEntity>) {
    Object.assign(this, partial);
  }
}
