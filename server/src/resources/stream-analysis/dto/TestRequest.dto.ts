import {
  IsString, IsDateString,
} from 'class-validator';

export class TestRequest {
  @IsString()
  creatorId: string;

  @IsString()
  streamId: string;

  // 프론트 엔드 요청 데이터 포맷 확인후 변경
  @IsDateString()
  startedAt: string;
}
