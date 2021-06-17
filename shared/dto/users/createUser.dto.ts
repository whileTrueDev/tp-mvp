import { IsBoolean, IsString, IsOptional } from 'class-validator';

// 필수로 필요한 것은 반드시 존재해야한다.
export class CreateUserDto {
  @IsString()
  userId: string;

  @IsString()
  nickName!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  userDI: string;

  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsString()
  mail!: string;

  @IsOptional()
  @IsString()
  birth: string;

  @IsOptional()
  @IsString()
  gender: string;

  @IsBoolean()
  marketingAgreement: boolean;
}
