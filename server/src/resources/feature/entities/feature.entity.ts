import {
  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn
} from 'typeorm';

@Entity('Feature')
export class FeatureEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '기능제안 구분' })
  category: string;

  @Column({ comment: '기능제안 작성자, 기본값 있음', default: 'TruePoint' })
  author: string;

  @Column({ comment: '기능제안 제목' })
  title: string;

  @Column('text', { comment: '기능제안 내용' })
  content: string;

  @Column('text', { comment: '관리자 답변' })
  reply: string;

  @Column({ comment: '답변상태 플래그' })
  progress: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
