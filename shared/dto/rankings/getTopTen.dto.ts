import { IsIn } from 'class-validator';

type Columns = 'smile'| 'frustrate'| 'admire'| 'cuss';
export class GetTopTenDto {
  @IsIn(['smile', 'frustrate', 'admire', 'cuss'])
  column: Columns
}
