export interface TodayTopViewerUser {
  nickname: string;
  viewer: number;
  platform: 'afreeca' | 'twitch';
  creatorId: string;
  afreecaLogo: string;
  twitchLogo: string;
}

export type TodayTopViewerUsersRes = TodayTopViewerUser[];
