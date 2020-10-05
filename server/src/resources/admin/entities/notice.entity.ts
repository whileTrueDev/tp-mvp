import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn
} from 'typeorm';

@Entity({ name: 'NoticeTest' })
export class NoticeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @Column()
  author: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  isImportant: number;

  @CreateDateColumn()
  createdAt: Date;

  constructor(partial: Partial<NoticeEntity>) {
    Object.assign(this, partial);
  }
}
