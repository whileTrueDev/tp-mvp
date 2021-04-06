import { CreatorComments } from '../interfaces/CreatorComments.interface';

export interface ICreatorCommentData extends CreatorComments{
  likesCount?: number;
  hatesCount?: number;
  createDate: Date;
}

export interface ICreatorCommentsRes {
  comments: ICreatorCommentData[],
  count: number;
}

export interface IGetLikes{
  userIp: string,
  likes: number[]
}

export interface IGetHates{
  userIp: string,
  hates: number[]
}
