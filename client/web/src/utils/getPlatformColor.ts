export default function getPlatformColor(platform: string): string {
  switch (platform) {
    case 'afreeca': return '#1f66de';
    case 'twitch': return '#772CE8';
    case 'youtube': return '#CC0000';
    default: throw new Error('platform은 "afreeca", "twitch", "youtube"중 하나여야 합니다.');
  }
}
