export interface Notice {
  id: number;

  category: string;

  author: string;

  title: string;

  content: string;

  isImportant: boolean;

  createdAt: Date;
}
