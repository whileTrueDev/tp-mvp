import {
  QueryFunctionContext, useInfiniteQuery, UseInfiniteQueryResult,
} from 'react-query';
import { AxiosError } from 'axios';
import { RankingDataType } from '@truepoint/shared/dist/res/RankingsResTypes.interface';
import axios from '../../axios';

type ToptenFilters = {
  column: string,
  platform: string,
  categoryId: number,
  skip: number
}
type TQueryKey = ['topten', Omit<ToptenFilters, 'skip'>];
type TPageParam = {skip: number};

const getToptenList = async (context: QueryFunctionContext<TQueryKey, TPageParam>) => {
  const { queryKey, pageParam = { skip: 0 } } = context;
  const { column, platform, categoryId } = queryKey[1];
  const { skip } = pageParam;

  const url = column === 'rating'
    ? '/ratings/daily-ranking'
    : '/rankings/top-ten';

  const { data } = await axios.get<RankingDataType>(url, {
    params: {
      column, platform, categoryId, skip,
    },
  });
  return data;
};

export default function useToptenList(filters: ToptenFilters): UseInfiniteQueryResult<RankingDataType, AxiosError> {
  const { column, platform, categoryId } = filters;
  const queryKey = { column, platform, categoryId };
  return useInfiniteQuery<RankingDataType, AxiosError, RankingDataType, TQueryKey>(
    ['topten', queryKey],
    getToptenList,
    {
      staleTime: 1000 * 60 * 60, // 5분간 fresh 상태 유지(refetch 발생 안함)
      keepPreviousData: true,
      getNextPageParam: (lastPage, pages) => ({ skip: ((pages.length - 1) * 10) + lastPage.rankingData.length }),
      // select: (data) => {
      //   const { pages, pageParams } = data;
      //   return {
      //     pages: [],
      //     pageParams,
      //   };
      // },
    },
  );
}
