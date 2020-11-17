export interface PlatformProfileImageBase {
  platform: 'twitch' | 'afreeca' | 'youtube';
  logo: string;
}
export type ProfileImages = PlatformProfileImageBase[];
