import { CreatorCategory } from './CreatorCategory.interface';

export interface PlatformTwitch {
  twitchId: string;

  logo: string;

  twitchStreamerName: string;

  twitchChannelName: string;

  refreshToken: string;

  createdAt?: Date;

  updatedAt?: Date;

  categories?: CreatorCategory[];

  searchCount?: number;
}
