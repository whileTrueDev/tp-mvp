import { PlatformAfreeca } from './PlatformAfreeca.interface';
import { PlatformTwitch } from './PlatformTwitch.interface';
import { PlatformYoutube } from './PlatformYoutube.interface';
import { Subscribe } from './Subscribe.interface';
import { UserDetail } from './UserDetail.interface';
import { FeatureSuggestion } from './FeatureSuggestion.interface';
import { FeatureSuggestionReply } from './FeatureSuggestionReply.interface';
import { CreatorComments } from './CreatorComments.interface';
import { CommunityReply } from './CommunityReply.interface';
import { CommunityPost } from './CommunityPost.interface';

export interface User {
  userId: string;

  nickName: string;

  name: string;

  mail: string;

  phone: string;

  userDI?: string;

  password: string;

  birth: string;

  gender: string;

  roles?: string;

  profileImage?: string;

  twitch?: PlatformTwitch;

  afreeca?: PlatformAfreeca;

  youtube?: PlatformYoutube;

  marketingAgreement: boolean;

  createdAt?: Date;

  updatedAt?: Date;

  subscribe?: Subscribe[];

  detail?: UserDetail;

  provider?: string;

  naverId?: string;

  kakaoId?: string;

  featureSuggestions?: FeatureSuggestion[];

  featureSuggestionReplies?: FeatureSuggestionReply[];

  creatorComments?: CreatorComments[];

  communityReplies?: CommunityReply[];

  communityPosts? : CommunityPost[];

  searchCount? : number;
}
