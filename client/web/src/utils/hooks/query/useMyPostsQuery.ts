import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { MyPostsRes } from '@truepoint/shared/dist/res/UserPropertiesResType.interface';
import { AxiosError } from 'axios';
import axios from '../../axios';
import { UserPropertyParams } from './useMyRatingsQuery';

async function getMyPosts(params: UserPropertyParams) {
  const { data } = await axios.get('/users/properties/posts', {
    params,
  });
  return data;
}

export function useMyPostsQuery(
  params: UserPropertyParams,
  options?: UseQueryOptions<MyPostsRes, AxiosError>,
): UseQueryResult<MyPostsRes, AxiosError> {
  return useQuery(
    ['myPosts', params],
    () => getMyPosts(params),
    {
      keepPreviousData: true,
      ...options,
    }
    ,
  );
}
