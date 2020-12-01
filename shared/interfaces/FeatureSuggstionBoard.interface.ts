export interface FeatureSuggestionBoard {
  id: number;

  category: number;

  author: string;

  title: string;

  content: string;

  reply: string | null;

  progress: number;

  createdAt: Date;

}
