import { IsString } from 'class-validator';

export class PasswordDto {
  @IsString()
  userDI!: string;

  @IsString()
  password!: string;
}
