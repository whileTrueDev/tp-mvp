import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { CommunityReply } from '@truepoint/shared/dist/interfaces/CommunityReply.interface';
import axios from '../../axios';

const getChildrenPostCommentList = async (replyId: number) => {
  const { data } = await axios.get(`community/replies/child/${replyId}`);
  return data;
};

export default function useChildrenPostCommentList(
  replyId: number,
  enabled = false,
): UseQueryResult<CommunityReply[], AxiosError> {
  return useQuery(
    ['childrenPostComment', replyId],
    () => getChildrenPostCommentList(replyId),
    {
      enabled,
    },
  );
}
