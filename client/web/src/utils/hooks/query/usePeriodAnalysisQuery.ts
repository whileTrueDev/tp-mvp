import { SearchEachS3StreamData } from '@truepoint/shared/dist/dto/stream-analysis/searchS3StreamData.dto';
import { PeriodAnalysisResType } from '@truepoint/shared/dist/res/PeriodAnalysisResType.interface';
import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';

async function getPeriodAnalysis(params: SearchEachS3StreamData[] | null) {
  const { data } = await axios.get('/stream-analysis/period', {
    params: {
      streams: params,
    },
  });
  return data;
}

export function usePeriodAnalysisQuery(
  params: SearchEachS3StreamData[] | null,
  options?: UseQueryOptions<PeriodAnalysisResType, AxiosError>,
): UseQueryResult<PeriodAnalysisResType, AxiosError> {
  return useQuery(
    ['periodAnalysis', params],
    () => getPeriodAnalysis(params),
    options,
  );
}
