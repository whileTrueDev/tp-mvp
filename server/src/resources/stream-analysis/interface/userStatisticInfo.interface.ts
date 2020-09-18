export interface UserStatisticInfo {
  userId: string;
  platform: string;
  fan: number; // 가장 최근 방송의 구독자 수
  viewer: number; // (총 시청자수)/(방송 개수)
  airTime: number; // (총 방송 시간)/(방송 개수)
  chatCount: number; // 총 채팅 발생 수
}
