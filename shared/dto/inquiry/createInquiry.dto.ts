import { IsString, IsEmail, IsBoolean } from 'class-validator';

export class CreateInquiryDto {
  @IsString()
  author: string;

  @IsEmail()
  email: string

  @IsString()
  content: string;

  @IsBoolean()
  privacyAgreement: boolean;
}
