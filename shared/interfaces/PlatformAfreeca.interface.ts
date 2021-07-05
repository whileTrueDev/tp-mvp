import { CreatorCategory } from './CreatorCategory.interface';

export interface PlatformAfreeca {
  afreecaId: string;

  refreshToken: string;

  logo?: string;

  afreecaStreamerName?: string;

  categories?: CreatorCategory[];

  searchCount?: number;
}
