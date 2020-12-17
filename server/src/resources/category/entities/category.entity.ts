import {
  Entity, Column, PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '@truepoint/shared/dist/interfaces/Category.interface';

@Entity({ name: 'CategoryTest' })
export class CategoryEntity implements Category {
  @PrimaryGeneratedColumn({ type: 'smallint' })
  categoryId: number;

  @Column()
  category: string;

  @Column()
  categoryName: string;

  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
  }
}
