import { useQuery, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import { HighlightPointListResType } from '@truepoint/shared/dist/res/HighlightPointListResType.interface';
import axios from '../../axios';

type Params = {
  platform: 'twitch' | 'afreeca',
  page: number,
  take: number,
  search?: string,
}
const getHighlightSearchList = async ({
  page, take, search, platform,
}: Params) => {
  const { data } = await axios.get(`/highlight/highlight-point-list/${platform}`, {
    params: {
      page,
      take,
      search,
    },
  });
  return data;
};

// 방송인 검색
export default function useHighlightSearchList(
  {
    page, take, search, platform,
  }: Params, onSuccess?: () => void,
): UseQueryResult<HighlightPointListResType, AxiosError> {
  let key: Record<string, any>;
  if (search) {
    key = { platform, page, search };
  } else {
    key = { platform, page };
  }
  return useQuery<HighlightPointListResType, AxiosError>(
    ['highlightList', key],
    () => getHighlightSearchList({
      platform, page, take, search,
    }),
    {
      keepPreviousData: true,
      staleTime: 1000 * 60,
      onSuccess,
    },
  );
}
