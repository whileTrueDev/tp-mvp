export interface Rankings{
  id: number;

  creatorId: string;

  platform: string;

  creatorName: string;

  createDate: Date;

  streamDate: Date;

  viewer: number;

  smileScore: number;

  frustrateScore: number;

  admireScore: number;
}