import {
  IsString,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class CreateCbtUserDto {
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
  @IsOptional()
  afreecaId: string;

  @IsString()
  phoneNum: string
}
