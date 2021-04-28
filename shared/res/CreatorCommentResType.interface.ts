import { CreatorComments } from '../interfaces/CreatorComments.interface';

export interface ICreatorCommentData extends CreatorComments{
  likesCount?: number;
  hatesCount?: number;
  createDate: Date;
  profileImage?: string;
  childrenCount?: number;
}

export interface ICreatorCommentsRes {
  comments: ICreatorCommentData[],
  count: number;
}
