import { useQuery, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import { CreatorListRes } from '@truepoint/shared/dist/res/CreatorList.interface';
import axios from '../../axios';

type SearchParams = {
  page: number,
  take: number,
  search?: string,
  sort?: string
}
const getCreatorSearchList = async ({
  page, take, search, sort,
}: SearchParams) => {
  const { data } = await axios.get('users/creator-list', {
    params: {
      page,
      take,
      search,
      sort,
    },
  });
  return data;
};

// 방송인 검색
export default function useCreatorSearchList(
  { page, take, search }: SearchParams, onSuccess?: () => void,
): UseQueryResult<CreatorListRes, AxiosError> {
  let key: Record<string, any>;
  if (search) {
    key = { page, take, search };
  } else {
    key = { page, take };
  }
  return useQuery<CreatorListRes, AxiosError>(
    ['creatorSearch', key],
    () => getCreatorSearchList({ page, take, search }),
    {
      keepPreviousData: true,
      staleTime: 1000 * 60,
      onSuccess,
    },
  );
}

// 많이 검색된 방송인 요청
export function useMostSearchedCreators(): UseQueryResult<CreatorListRes, AxiosError> {
  return useQuery<CreatorListRes, AxiosError>(
    ['mostSearchedCreators'],
    () => (
      getCreatorSearchList({
        take: 20,
        page: 1,
        sort: 'searchCount',
      })
    ),
    {
      staleTime: 1000 * 60 * 5,
    },
  );
}
