import {
  IsNumberString, IsOptional,
} from 'class-validator';

export class ReplyGet {
  @IsNumberString()
  @IsOptional()
  id: number;
}
