import { CbtInquiry } from '@truepoint/shared/dist/interfaces/CbtInquiry.interface';
import {
  Entity, Column, CreateDateColumn, PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'CbtInquiry' })
export class CbtInquiryEntity implements CbtInquiry {
  // For Exclude Decorator
  constructor(partial: Partial<CbtInquiryEntity>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 'CBT 신청자' })
  name!: string;

  @Column({ comment: 'CBT 신청자 테스트 ID' })
  idForTest!: string;

  @Column({ comment: 'CBT 신청자 플랫폼' })
  platform!: string;

  @Column({ comment: 'CBT 신청자 활동명' })
  creatorName!: string;

  @Column({ comment: 'CBT 신청자의 연락처' })
  phoneNum!: string;

  @Column('mediumtext', { comment: '기타문의 내용' })
  content!: string;

  @Column({ comment: '개인정보 제공 동의, 0=미동의,1=동의' })
  privacyAgreement: boolean;

  @CreateDateColumn()
  createdAt?: Date;
}
