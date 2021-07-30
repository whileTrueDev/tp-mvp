import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import { FindReplyResType } from '@truepoint/shared/dist/res/FindReplyResType.interface';
import axios from '../../axios';

type Params = {
  page: number,
  take: number,
  postId: number,
}
const getPostCommentList = async ({
  page, take, postId,
}: Params) => {
  const { data } = await axios.get('/community/replies', {
    params: {
      page,
      take,
      postId,
    },
  });
  return data;
};

type Options = UseQueryOptions<FindReplyResType, AxiosError>;

// 자유게시판 댓글 목록
export default function usePostCommentList(
  { page, take, postId }: Params,
  options?: Options,
): UseQueryResult<FindReplyResType, AxiosError> {
  return useQuery<FindReplyResType, AxiosError>(
    ['postComments', postId, page],
    () => getPostCommentList({ page, take, postId }),
    {
      keepPreviousData: true,
      ...options,
    },
  );
}
