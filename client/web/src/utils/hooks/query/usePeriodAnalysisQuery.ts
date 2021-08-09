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

type Key = {
  platform: string;
  streamId: string;
}[] | undefined;
export function makeKey(params: SearchEachS3StreamData[] | null): Key {
  const key = params?.map((param) => {
    const { platform, streamId } = param;
    return { platform, streamId };
    });
  return key;
}

export function usePeriodAnalysisQuery(
  params: SearchEachS3StreamData[] | null,
  options?: UseQueryOptions<PeriodAnalysisResType, AxiosError>,
): UseQueryResult<PeriodAnalysisResType, AxiosError> {
  return useQuery(
    ['periodAnalysis', makeKey(params)],
    () => getPeriodAnalysis(params),
    options,
  );
}
