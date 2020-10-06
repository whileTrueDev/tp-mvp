import { SpawnSyncOptionsWithBufferEncoding } from 'child_process';

export interface FeatureData {
  id: number;
  category: string;
  author: string;
  title: string;
  content: string;
  createdAt: string;
  progress: number;
  reply: string;
}
