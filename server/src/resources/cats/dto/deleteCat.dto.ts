import { IsInt } from 'class-validator';

export class DeleteCatDto {
  @IsInt()
  id: number;
}
