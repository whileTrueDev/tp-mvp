import { SearchStreamInfoByPeriods } from '@truepoint/shared/dist/dto/stream-analysis/searchStreamInfoByPeriods.dto';
import { PeriodsAnalysisResType } from '@truepoint/shared/dist/res/PeriodsAnalysisResType.interface';
import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type Params = SearchStreamInfoByPeriods | null;

async function getPeriodsAnalysis(params: Params) {
  const { data } = await axios.post<PeriodsAnalysisResType>(
    '/stream-analysis/periods',
    params,
  );
  return data;
}

// TODO: unique 키 생성
// 지금 param으로 들어오는 EachStream 타입에 streamId 등 고유값이 설정되어 있지 않아서
// 전체 param을 그대로 키로 넘김
export function makeKey(params: Params): any {
  return params;
}

// 해당 요청시 사용되는 http 메서드는 post이지만 
// 서버 데이터를 변경하지 않으므로 Mutation 대신 useQuery사용함
export function usePeriodVsPeriodAnalysisQuery(
  params: Params,
  options?: UseQueryOptions<PeriodsAnalysisResType, AxiosError>,
): UseQueryResult<PeriodsAnalysisResType, AxiosError> {
  return useQuery(
    ['periodVsPeriodAnalysis', makeKey(params)],
    () => getPeriodsAnalysis(params),
    options,
  );
}
