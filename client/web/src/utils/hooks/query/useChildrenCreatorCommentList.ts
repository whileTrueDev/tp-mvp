import { AxiosError } from 'axios';
import {
  QueryFunction, useQuery, UseQueryResult,
} from 'react-query';
import { ICreatorCommentData } from '@truepoint/shared/dist/res/CreatorCommentResType.interface';
import axios from '../../axios';

type QueryKey = ['childrenCreatorComment', number];

const getChildrenCreatorCommentList: QueryFunction<ICreatorCommentData[], QueryKey> = async (context) => {
  const { queryKey } = context;
  const commentId = queryKey[1];
  const { data } = await axios.get(`creatorComment/replies/${commentId}`);
  return data;
};

export default function useChildrenCreatorCommentList(
  commentId: number,
  enabled = false,
): UseQueryResult<ICreatorCommentData[], AxiosError> {
  return useQuery(
    ['childrenCreatorComment', commentId],
    getChildrenCreatorCommentList,
    {
      enabled,
    },
  );
}
