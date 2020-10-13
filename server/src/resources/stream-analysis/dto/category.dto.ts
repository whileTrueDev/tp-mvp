import {
  IsString, IsIn,
} from 'class-validator';

export class Category {
  @IsString()
  @IsIn(['viewer', 'chat', 'smile'])
  category: string;
}
