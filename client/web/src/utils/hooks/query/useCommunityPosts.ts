import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import { FindPostResType } from '@truepoint/shared/dist/res/FindPostResType.interface';
import axios from '../../axios';
import { BoardPlatform, FilterType } from '../../../store/useCommunityBoardState';

export type PostGetParam = {
  platform: BoardPlatform,
  category: FilterType,
  page: number,
  take: number,
  qtext?: string,
  qtype?: string,
}

async function getPosts(props: PostGetParam) {
  const { data } = await axios.get('/community/posts', {
    params: props,
  });
  return data;
}

interface Props {
  params: PostGetParam,
  options?: UseQueryOptions<FindPostResType, AxiosError>
}

export default function useCommunityPosts(props: Props): UseQueryResult<FindPostResType, AxiosError> {
  const { params, options } = props;
  const {
    platform, page, category, qtext,
  } = params;
  let key: Record<string, any>;
  if (qtext) {
    key = { page, platform, search: qtext };
  } else {
    key = { page, platform, category };
  }
  return useQuery<FindPostResType, AxiosError>(
    ['community', key],
    () => getPosts(params),
    options,
  );
}

// hot 게시물 요청
const MAX_HOT_POST_TAKE = 8;
interface HotPostProps {
  platform: 'twitch' | 'afreeca',
  options?: UseQueryOptions<FindPostResType, AxiosError>
}
export function useHotPostsByPlatform(props: HotPostProps): UseQueryResult<FindPostResType, AxiosError> {
  const { platform, options } = props;

  return useQuery<FindPostResType, AxiosError>(
    ['communityHotPosts', { platform }],
    () => getPosts({
      platform,
      page: 0,
      take: MAX_HOT_POST_TAKE,
      category: 'recommended',
    }),
    options,
  );
}
