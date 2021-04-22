import { IsIn, IsOptional, IsString } from 'class-validator';

export class RegisterUserByAdminDto {
  @IsString()
  userId: string;

  @IsString()
  nickname: string;

  @IsIn(['twitch', 'afreeca'])
  platform: 'twitch' | 'afreeca';

  @IsString()
  platformId: string;

  @IsString()
  password: string;

  @IsString()
  logo: string;

  @IsOptional()
  @IsString()
  twitchCreatorId?: string;
}
