// 유저 마이페이지 - 본인 작성 글, 댓글 조회 라우터의 리턴타입

export interface MyPost {
  to: string; // 해당 댓글이 존재하는 글 페이지로 이동하기 위한 url
  postId: number;
  title: string; // 글 제목
  createDate: Date;
  belongTo: string; // 해당 댓글이 존재하는 게시판이름
}
export interface MyPostsRes {
  totalCount: number;
  totalPage: number;
  hasMore: boolean;
  posts: MyPost[];
}

export interface MyComment{
  to: string; // 해당 댓글이 존재하는 글 페이지로 이동하기 위한 url
  commentId: number;
  createDate: Date;
  content: string; // 댓글 내용
  belongTo: string; // 해당 댓글이 존재하는 게시판이름
}

export interface MyCommentsRes{
  totalCount: number;
  totalPage: number;
  hasMore: boolean;
  comments: MyComment[]
}
