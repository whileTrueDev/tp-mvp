import { CommunityPost } from '../interfaces/CommunityPost.interface';

export type FindedPost = {
  postNumber: number;
} & Partial<CommunityPost>

export interface FindPostResType{
  posts: FindedPost[];
  total: number;
}
