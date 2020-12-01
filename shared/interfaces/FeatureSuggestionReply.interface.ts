import { User } from './User.interface';

export interface FeatureSuggestionReply {
  replyId: number;

  suggestionId: number;

  content: string;

  author: User;

  createdAt: Date;

}
