import { IsString, IsBoolean, IsEmail } from 'class-validator';

export class CreateCbtInquiryDto {
  @IsString()
  name: string;

  @IsString()
  idForTest: string;

  @IsString()
  creatorName: string

  @IsEmail()
  email: string

  @IsString()
  platform: string

  @IsString()
  phoneNum: string

  @IsString()
  content: string;

  @IsBoolean()
  privacyAgreement: boolean;
}
