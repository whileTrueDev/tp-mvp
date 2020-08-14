import { IsInt, IsString } from 'class-validator';
import { Cat } from '../interfaces/cats.interface';

export class CreateCatDto implements Cat {
  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  breed: string;
}
