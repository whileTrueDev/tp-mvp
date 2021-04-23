export interface TodayTopViewerUser {
  nickname: string;
  viewer: number;
  platform: 'afreeca' | 'twitch';
  creatorId: string;
  logo: string;
}

export type TodayTopViewerUsersRes = TodayTopViewerUser[];
