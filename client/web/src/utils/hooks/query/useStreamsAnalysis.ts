import { SearchStreamInfoByStreamId } from '@truepoint/shared/dist/dto/stream-analysis/searchStreamInfoByStreamId.dto';
import { StreamAnalysisResType } from '@truepoint/shared/res/StreamAnalysisResType.interface';
import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';

async function getStreamsAnalysis(params: SearchStreamInfoByStreamId | null) {
  const { data } = await axios.get<StreamAnalysisResType[]>('/stream-analysis/streams', {
    params,
  });
  return data;
}

export function useStreamsAnalysisQuery(
  params: SearchStreamInfoByStreamId | null,
  options?: UseQueryOptions<StreamAnalysisResType[], AxiosError>,
): UseQueryResult<StreamAnalysisResType[], AxiosError> {
  return useQuery(
    ['streamsAnalysis', params],
    () => getStreamsAnalysis(params),
    options,
  );
}
