import { AxiosError } from 'axios';
import {
  QueryFunction, useQuery, UseQueryResult,
} from 'react-query';
import { ICreatorCommentsRes } from '@truepoint/shared/dist/res/CreatorCommentResType.interface';
import axios from '../../axios';

type Params = {
  creatorId: string
  skip: number;
  order: 'date' | 'recommend';
}
type QueryKey = ['creatorComment', Params];

const getChildrenCreatorCommentList: QueryFunction<ICreatorCommentsRes, QueryKey> = async (context) => {
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

export default function useChildrenCreatorCommentList(
  params: Params,
): UseQueryResult<ICreatorCommentsRes, AxiosError> {
  return useQuery(
    ['creatorComment', params],
    getChildrenCreatorCommentList,
    {
      staleTime: 1000 * 60 * 60 * 12, // 12시간 fresh 상태 유지(refetch 발생 안함)
    },
  );
}
