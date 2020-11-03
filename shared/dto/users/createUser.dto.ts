import { IsBoolean, IsString } from 'class-validator';

// 필수로 필요한 것은 반드시 존재해야한다.
export class CreateUserDto {
  @IsString()
  userId: string;

  @IsString()
  nickName!: string;

  @IsString()
  name!: string;

  @IsString()
  userDI: string;

  @IsString()
  password!: string;

  @IsString()
  phone!: string;

  @IsString()
  mail!: string;

  @IsString()
  birth!: string;

  @IsString()
  gender!: string;

  @IsBoolean()
  marketingAgreement: boolean;
}