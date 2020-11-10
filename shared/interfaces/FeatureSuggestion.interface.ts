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

  createdAt: Date;

  replies?: FeatureSuggestionReply[];
}
