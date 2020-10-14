import { Inquiry } from '@truepoint/shared/dist/interfaces/Inquiry.interface';
import {
  Entity, Column, CreateDateColumn, PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'Inquiry' })
export class InquiryEntity implements Inquiry {
  // For Exclude Decorator
  constructor(partial: Partial<InquiryEntity>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '문의 작성자' })
  author!: string;

  @Column({ comment: '문의 작성자의 이메일 주소' })
  email!: string;

  @Column('mediumtext', { comment: '문의 내용' })
  content!: string;

  @Column({ comment: '답변 여부, 0=답변안함(답변필요) 1=답변완료', default: false })
  isReply?: boolean;

  @Column({ comment: '개인정보 제공 동의, 0=미동의,1=동의' })
  privacyAgreement: boolean;

  @CreateDateColumn()
  createdAt?: Date;
}
