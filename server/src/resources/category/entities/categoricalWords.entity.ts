import {
  Entity, Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoricalWords } from '@truepoint/shared/dist/interfaces/CategoricalWords.interface';
import { CategoryEntity } from './category.entity';

@Entity({ name: 'CategoricalWords' })
export class CategoricalWordsEntity implements CategoricalWords {
  @PrimaryGeneratedColumn()
  wordId: number;

  @JoinColumn()
  @ManyToOne((type) => CategoryEntity, (category) => category.categoryId)
  categoryId: number;

  @Column()
  word: string;

  @Column()
  weight: number;

  constructor(partial: Partial<CategoricalWordsEntity>) {
    Object.assign(this, partial);
  }
}
