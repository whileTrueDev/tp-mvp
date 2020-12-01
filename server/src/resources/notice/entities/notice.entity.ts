import { Notice } from '@truepoint/shared/dist/interfaces/Notice.interface';
import {
  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Notice')
export class NoticeEntity implements Notice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '공지사항 구분',
    type: 'varchar',
    length: 50,
  })
  category: string;

  @Column({
    comment: '공지사항 작성자, 기본값 있음',
    default: 'TruePoint',
    type: 'varchar',
    length: 50,
  })
  author: string;

  @Column({ comment: '공지사항 제목' })
  title: string;

  @Column('text', { comment: '공지사항 내용' })
  content: string;

  @Column({ comment: '중요 공지 플래그', type: 'boolean', default: 0 })
  isImportant: boolean;

  @CreateDateColumn()
  createdAt: Date;

  constructor(partial: Partial<NoticeEntity>) {
    Object.assign(this, partial);
  }
}
