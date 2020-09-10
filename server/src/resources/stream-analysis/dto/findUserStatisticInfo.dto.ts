import {
  IsString, IsDateString, IsDate,
} from 'class-validator';

export class findUserStatisticInfo {
  @IsString()
  userId: string;

  // 프론트 엔드 요청 데이터 포맷 확인후 변경
  @IsDateString()
  nowDate: string;
}
