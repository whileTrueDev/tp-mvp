import { CreatorComments } from '../interfaces/CreatorComments.interface';

export interface ICreatorCommentData extends CreatorComments{
  likesCount?: number;
  hatesCount?: number;
  createDate: Date;
  profileImage?: string;
}

export interface ICreatorCommentsRes {
  comments: ICreatorCommentData[],
  count: number;
}
