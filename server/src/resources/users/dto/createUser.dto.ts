import { IsBoolean, IsString } from 'class-validator';
import { UserEntity } from '../entities/user.entity';

export class CreateUserDto implements UserEntity {
  @IsString()
  userId: string;

  @IsString()
  password!: string;

  @IsString()
  name!: string;

  @IsString()
  mail!: string;

  @IsString()
  birth!: string;

  @IsString()
  gender!: string;

  @IsBoolean()
  marketingAgreement: boolean;
}
