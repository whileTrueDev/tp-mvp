import {
  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn
} from 'typeorm';

@Entity('Notice')
export class NoticeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '공지사항 구분' })
  category: string;

  @Column({ comment: '공지사항 작성자, 기본값 있음', default: 'TruePoint' })
  author: string;

  @Column({ comment: '공지사항 제목' })
  title: string;

  @Column('text', { comment: '공지사항 내용' })
  content: string;

  @Column({ comment: '중요 공지 플래그' })
  isImportant: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
