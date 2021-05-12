export interface CreatorCommentVote{
  id: number;

  commentId: number;

  userId?: string;

  userIp: string;

  vote: boolean;
}
