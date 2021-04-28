import { FeatureSuggestionReply } from './FeatureSuggestionReply.interface';
import { User } from './User.interface';

export interface FeatureSuggestion {
  suggestionId: number;

  category: string;

  title: string;

  content: string;

  author: User;

  userIp: string;

  password: string;

  state: number;

  like: number;

  isLock?: boolean;

  createdAt: Date;

  replies?: FeatureSuggestionReply[];
}
