// users.service.getAllUserBriefInfoList 반환 데이터 타입
export interface BriefInfoData {
  userId: string;
  nickName: string;
  recentBroadcastDate: Date | null;
  averageViewer: number;
}

export declare type BriefInfoDataResType = BriefInfoData[];
