import { QueryFunctionContext, useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import { RankingDataType } from '@truepoint/shared/dist/res/RankingsResTypes.interface';
import axios from '../../axios';

type ToptenFilters = {
  column: string,
  platform: string,
  categoryId: number,
  skip: number
}

const getToptenList = async (context: QueryFunctionContext) => {
  const { queryKey, pageParam = { skip: 0 } } = context;
  const [column, platform, categoryId] = queryKey.slice(1);
  const { skip } = pageParam;

  if (column === 'rating') {
    const { data } = await axios.get('/ratings/daily-ranking', {
      params: {
        column, platform, categoryId, skip,
      },
    });
    return data;
  }
  const { data } = await axios.get('/rankings/top-ten', {
    params: {
      column, platform, categoryId, skip,
    },
  });
  return data;
};

export default function useToptenList(filters: ToptenFilters): UseInfiniteQueryResult<RankingDataType, AxiosError> {
  const {
    column, platform, categoryId,
  } = filters;

  return useInfiniteQuery<RankingDataType, AxiosError>(
    ['topten', column, platform, categoryId],
    getToptenList,
    {
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
