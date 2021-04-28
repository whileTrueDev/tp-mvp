// tp 익명 자유게시판(아프리카, 트위치) 댓글 interface

export interface CommunityReply{
  replyId: number;

  userId?: string;

  ip: string;

  nickname: string;

  content: string;

  password: string;

  createDate: Date;

  postId: number;
}
