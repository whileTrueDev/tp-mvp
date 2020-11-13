import { FeatureSuggestionReply } from './FeatureSuggestionReply.interface';

export interface FeatureSuggestion {
  suggestionId: number;

  category: string;

  title: string;

  content: string;

  author: string;

  userId: string;

  state: number;

  like: number;

  isLock?: boolean;

  createdAt: Date;

  replies?: FeatureSuggestionReply[];
}
