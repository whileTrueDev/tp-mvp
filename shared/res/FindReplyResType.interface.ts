import { CommunityReply } from '../interfaces/CommunityReply.interface';

export interface FindReplyResType {
  replies: CommunityReply[],
  total: number;
}
