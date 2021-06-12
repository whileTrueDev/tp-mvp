// tp 익명 자유게시판(아프리카, 트위치) 글 interface
import { CommunityReply } from './CommunityReply.interface';

export interface CommunityPost{
  postId: number;

  title: string;

  content: string;

  nickname: string;

  ip: string;

  password: string;

  createDate: Date;

  platform: number;

  category: number;

  hit: number;

  recommend: number;

  notRecommendCount: number;

  replies? : CommunityReply[];

  userId: string;
}
