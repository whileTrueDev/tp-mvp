import { IsIn, IsNumber, IsString } from 'class-validator';

export class AddCreatorToCategoryDto {
  @IsIn(['twitch', 'afreeca'])
  platform: 'twitch' | 'afreeca';

  @IsString()
  creatorId: string;

  @IsNumber()
  categoryId: number
}
