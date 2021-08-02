import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import { FindPostResType } from '@truepoint/shared/dist/res/FindPostResType.interface';
import { PostGetParam } from '../useBoardListState';
import axios from '../../axios';

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
  const { platform, page, category } = params;
  return useQuery<FindPostResType, AxiosError>(
    ['community', { platform, page, category }],
    () => getPosts(params),
    options,
  );
}
