export interface Notification {
  index: number;

  userId: string;

  title: string;

  content: string;

  readState: number;

  createdAt: Date;
}
