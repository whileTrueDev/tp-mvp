import {
  // UseGuards, 
  Controller, Get, Query, Param,
} from '@nestjs/common';
import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';
import { BroadcastDataForDownload } from '@truepoint/shared/dist/interfaces/BroadcastDataForDownload.interface';
import { SearchCalendarStreams } from '@truepoint/shared/dist/dto/stream-analysis/searchCalendarStreams.dto';
// import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

// service
import { BroadcastInfoService } from './broadcast-info.service';

// pipe
import { ValidationPipe } from '../../pipes/validation.pipe';

@Controller('broadcast-info')
export class BroadcastInfoController {
  constructor(private readonly broadcastService: BroadcastInfoService) {}

  /**
   * 방송 정보 조회 GET 라우터
   * @param findDaysStreamRequest 로그인 유저 아이디, 조회 시작 날짜 00시 00분 , 조회 종료 날짜 23시 59분
   */
  @Get()
  // @UseGuards(JwtAuthGuard) // 가드 임시 주석처리
  getCompleteStreamsList(@Query(new ValidationPipe())
    findDaysStreamRequest: SearchCalendarStreams): Promise<StreamDataType[]> {
    return this.broadcastService.findDayStreamList(
      findDaysStreamRequest.userId,
      findDaysStreamRequest.startDate,
      findDaysStreamRequest.endDate,
    );
  }

  /**
   * 관리자페이지 이용자정보 조회탭에서 사용
   * userId를 받아 해당 유저의 전체 방송 목록 조회
   * @param userId 방송목록 조회할 유저의 userId
   */
  @Get(':userId')
  getStreamsByUserId(@Param('userId') userId: string): Promise<BroadcastDataForDownload[]> {
    return this.broadcastService.getStreamsByUserId(userId);
  }
}
