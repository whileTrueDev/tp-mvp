import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { CreatorAvatarProps } from '../../../organisms/mypage/userInfo/MyRatings';
import axios from '../../axios';

type Params = {
  userId: string,
  page: number,
  itemPerPage: number
}

type Return = {
  hasMore: boolean;
  creators: CreatorAvatarProps[]
}

async function getRatedCreators(params: Params) {
  const { data } = await axios.get('/ratings/mypage', {
    params,
  });
  return data;
}

export function useMyRatings(
  params: Params,
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
