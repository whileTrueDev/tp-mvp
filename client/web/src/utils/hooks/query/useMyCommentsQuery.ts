import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { MyCommentsRes } from '@truepoint/shared/dist/res/UserPropertiesResType.interface';
import { AxiosError } from 'axios';
import axios from '../../axios';
import { UserPropertyParams } from './useMyRatingsQuery';

async function getMyComments(params: UserPropertyParams) {
  const { data } = await axios.get('/users/properties/comments', {
    params,
  });
  return data;
}

export function useMyCommentsQuery(
  params: UserPropertyParams,
  options?: UseQueryOptions<MyCommentsRes, AxiosError>,
): UseQueryResult<MyCommentsRes, AxiosError> {
  return useQuery(
    ['myComments', params],
    () => getMyComments(params),
    {
      keepPreviousData: true,
      ...options,
    }
    ,
  );
}
