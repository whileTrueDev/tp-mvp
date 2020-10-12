import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn
} from 'typeorm';

@Entity({ name: 'NoticeTest' })
export class NoticeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50
  })
  category: string;

  @Column({
    type: 'varchar',
    length: 50
  })
  author: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ type: 'boolean', default: 0 })
  isImportant: boolean;

  @CreateDateColumn()
  createdAt: Date;

  constructor(partial: Partial<NoticeEntity>) {
    Object.assign(this, partial);
  }
}
