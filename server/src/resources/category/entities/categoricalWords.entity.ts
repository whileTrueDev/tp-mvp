import {
  Entity, Column, PrimaryColumn, JoinColumn, ManyToOne,
} from 'typeorm';
import { CategoricalWords } from '@truepoint/shared/dist/interfaces/CategoricalWords.interface';
import { CategoryEntity } from './category.entity';

@Entity({ name: 'CategoricalWords' })
export class CategoricalWordsEntity implements CategoricalWords {
  @PrimaryColumn()
  wordId: string;

  @JoinColumn()
  @ManyToOne((type) => CategoryEntity, (category) => category.categoryId)
  categoryId: string;

  @Column()
  word: string;

  @Column()
  weight: number;
}
