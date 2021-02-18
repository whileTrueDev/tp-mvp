import { CommunityPost } from '../interfaces/CommunityPost.interface';

export type PostFound = {
  postNumber: number;
  replies: number;
} & Partial<CommunityPost>

export interface FindPostResType{
  posts: PostFound[];
  total: number;
}
