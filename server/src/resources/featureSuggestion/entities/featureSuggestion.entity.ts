// import { FeatureSuggestion } from '@truepoint/shared/dist/interfaces/FeatureSuggestion.interface'; // Reply등, DB구조 확실히 정해진 뒤 올바르게 interface 정의 
import {
  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('FeatureSuggestion')
export class FeatureSuggestionEntity {
// export class FeatureSuggestionEntity implements FeatureSuggestion { // Reply등, DB구조 확실히 정해진 뒤 올바른 interface를 implements 하는 방식으로 변경
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '기능제안 구분' })
  category: number;

  @Column({ comment: '기능제안 작성자' })
  author: string;

  @Column({ comment: '기능제안 제목' })
  title: string;

  @Column('text', { comment: '기능제안 내용' })
  content: string;

  @Column('text', { comment: '관리자 답변', nullable: true })
  reply: string | null;

  @Column({ comment: '답변상태 플래그 0=미확인, 1=승인, 2=보류' })
  progress: number;

  @CreateDateColumn()
  createdAt: Date;
}
