import {
  Controller, UseGuards, Get, Query, Param,
} from '@nestjs/common';
import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';
import { SearchCalendarStreams } from '@truepoint/shared/dist/dto/stream-analysis/searchCalendarStreams.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard)
  getCompleteStreamsList(@Query(new ValidationPipe())
    findDaysStreamRequest: SearchCalendarStreams): Promise<StreamDataType[]> {
    return this.broadcastService.findDayStreamList(
      findDaysStreamRequest.userId,
      findDaysStreamRequest.startDate,
      findDaysStreamRequest.endDate,
    );
  }

  @Get(':userId')
  getStreamsByUserId(@Param() param: Record<string, any>): Promise<any> {
    const { userId } = param;
    return this.broadcastService.getStreamsByUserId(userId);
  }
}
