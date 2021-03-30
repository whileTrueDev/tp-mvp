import { CommunityPost } from '../interfaces/CommunityPost.interface';

export type PostFound = {
  postNumber: number;
  repliesCount: number;
} & Partial<CommunityPost>

export interface FindPostResType{
  posts: PostFound[];
  total: number;
}
