import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type HighLightparams = {
  streamId: string,
  platform: string,
  creatorId: string
}

async function getHighlightPoints(params: HighLightparams) {
  const { data } = await axios.get('/highlight/highlight-points', { params });
  return data;
}

export function useHighlightPoints({ params, options }: {
  params: HighLightparams,
  options?: UseQueryOptions<any, AxiosError>
}): UseQueryResult<any, AxiosError> {
  return useQuery(
    ['highlightPoints', params],
    () => getHighlightPoints(params),
    options,
  );
}
