import {
  Entity, Column, PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoricalWords } from '@truepoint/shared/dist/interfaces/CategoricalWords.interface';

@Entity({ name: 'CategoricalWords' })
export class CategoricalWordsEntity implements CategoricalWords {
  @PrimaryGeneratedColumn()
  wordId: number;

  @Column({ type: 'smallint' })
  categoryId: number;

  @Column()
  word: string;

  @Column({ type: 'float' })
  weight: number;

  constructor(partial: Partial<CategoricalWordsEntity>) {
    Object.assign(this, partial);
  }
}
