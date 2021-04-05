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
