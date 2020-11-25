import {
  Entity, Column, PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '@truepoint/shared/dist/interfaces/Category.interface';

@Entity({ name: 'Category' })
export class CategoryEntity implements Category {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column()
  category: string;

  @Column()
  categoryName: string;

  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
  }
}
