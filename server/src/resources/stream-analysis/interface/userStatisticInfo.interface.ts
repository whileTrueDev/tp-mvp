export interface UserStatisticInfo {
  avgViewer: number; // (총 시청자수)/(방송 개수)
  changeFan: number; // 가장 최근 방송의 구독자 수
  avgAirTime: number; // (총 방송 시간)/(방송 개수)
  totalChatCount: number; // 총 채팅 발생 수
  count: number; // 해당 자료형에 합산된 방송 개수
}
