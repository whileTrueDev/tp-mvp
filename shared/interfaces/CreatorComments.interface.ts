import { CommentBase } from './CommentBase.interface';

export interface CreatorComments extends CommentBase{
  creatorId: string;
}
