import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { CreatorAvatarProps } from '../../../organisms/mypage/userInfo/MyRatings';
import axios from '../../axios';

export type UserPropertyParams = {
  userId: string,
  page: number,
  itemPerPage: number
}

type Return = {
  hasMore: boolean;
  creators: CreatorAvatarProps[]
}

async function getRatedCreators(params: UserPropertyParams) {
  const { data } = await axios.get('/ratings/mypage', {
    params,
  });
  return data;
}

export function useMyRatings(
  params: UserPropertyParams,
  options?: UseQueryOptions<Return, AxiosError>,
): UseQueryResult<Return, AxiosError> {
  return useQuery(
    ['ratedCreators', params],
    () => getRatedCreators(params),
    {
      keepPreviousData: true,
      ...options,
    },
  );
}
