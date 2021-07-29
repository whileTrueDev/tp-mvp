import { AxiosError } from 'axios';
import { QueryFunction, useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';
import { ICreatorCommentsRes } from '@truepoint/shared/dist/res/CreatorCommentResType.interface';
import axios from '../../axios';

type Params = {
  creatorId: string
  skip: number;
  order: 'date' | 'recommend';
}
type QueryKey = ['creatorComment', Params];

const getCreatorCommentList: QueryFunction<ICreatorCommentsRes, QueryKey> = async (context) => {
  const { queryKey, pageParam = { skip: 0 } } = context;
  const { creatorId, order } = queryKey[1];
  const { data } = await axios.get(`/creatorComment/${creatorId}`, {
    params: {
      skip: pageParam.skip,
      order,
    },
  });
  return data;
};

export default function useCreatorCommentList(
  params: Params,
): UseInfiniteQueryResult<ICreatorCommentsRes, AxiosError> {
  return useInfiniteQuery(
    ['creatorComment', params],
    getCreatorCommentList,
    {
      getNextPageParam: (lastPage, pages) => ({ skip: ((pages.length - 1) * 10) + lastPage.comments.length }),
      keepPreviousData: true,
      staleTime: 1000 * 60 * 60 * 12, // 12시간 fresh 상태 유지(refetch 발생 안함)
    },
  );
}
