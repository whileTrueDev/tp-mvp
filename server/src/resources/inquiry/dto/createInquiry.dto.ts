import { IsString, IsEmail, IsBoolean } from 'class-validator';
import { InquiryEntity } from '../entities/inquiry.entity';

export class CreateInquiryDto implements Omit<InquiryEntity, 'id'> {
  @IsString()
  author: string;

  @IsEmail()
  email: string

  @IsString()
  content: string;

  @IsBoolean()
  privacyAgreement: boolean;
}
