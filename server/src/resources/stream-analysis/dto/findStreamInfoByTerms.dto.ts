import {
  IsString, IsDateString, IsDate,
} from 'class-validator';

export class findStreamInfoByTerms {
  @IsString()
  userId: string;

  // 프론트 엔드 요청 데이터 포맷 확인후 변경
  @IsString()
  startAt: Date;

  // 프론트 엔드 요청 데이터 포맷 확인후 변경
  @IsString()
  endAt: Date;
}
