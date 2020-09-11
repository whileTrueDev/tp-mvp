import { UserStatisticsInterface } from '../interface/userStatisticInfo.interface';

export class UserStatisticInfo {
  avgViewer: number;
  changeFan: number;
  avgAirTime: number;
  totalChatCount: number;
  count: number;

  constructor() {
    this.count = 0;
    this.totalChatCount = 0;
    this.changeFan = 0;
    this.avgAirTime = 0;
    this.avgViewer = 0;
  }

  // 3사 통합 및 각 플랫폼 구독자수 변화량 계산 추후 추가 필요
  pushData(data: UserStatisticsInterface): void {
    this.count += 1;
    this.totalChatCount += data.chatCount;
    this.avgViewer += data.viewer;
    this.changeFan = data.fan;
    this.avgAirTime += data.airTime;
  }

  calculateData(): void {
    if (this.count > 1) {
      this.avgAirTime /= this.count;
      this.avgViewer /= this.count;
    }
  }
}
