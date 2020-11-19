export interface ChannelNameBase {
  platform: 'twitch' | 'afreeca' | 'youtube';
  nickName: string;
}
export type ChannelNames = ChannelNameBase[];
