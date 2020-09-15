import {
  IsString, IsDateString,
} from 'class-validator';

export class FindStreamInfoByTerms {
  @IsString()
  userId: string;

  // 프론트 엔드 요청 데이터 포맷 확인후 변경
  @IsDateString()
  startAt: string;

  // 프론트 엔드 요청 데이터 포맷 확인후 변경
  @IsDateString()
  endAt: string;
}
