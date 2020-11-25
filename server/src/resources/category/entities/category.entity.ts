import {
  Entity, Column, PrimaryColumn,
} from 'typeorm';
import { Category } from '@truepoint/shared/dist/interfaces/Category.interface';

@Entity({ name: 'CategoricalWords' })
export class CategoryEntity implements Category {
  @PrimaryColumn()
  categoryId: string;

  @Column()
  category: string;

  @Column()
  categoryName: string;
}
