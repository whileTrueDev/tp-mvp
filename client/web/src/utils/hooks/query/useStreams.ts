import { SearchCalendarStreams } from '@truepoint/shared/dist/dto/stream-analysis/searchCalendarStreams.dto';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';
import { AxiosError } from 'axios';
import axios from '../../axios';

async function getStreams(params: SearchCalendarStreams | null) {
  const { data } = await axios.get('/broadcast-info', {
    params,
  });
  return data;
}

export function useStreams(
  params: SearchCalendarStreams | null,
  options?: UseQueryOptions<StreamDataType[], AxiosError>,
): UseQueryResult<StreamDataType[], AxiosError> {
  return useQuery(
    ['streams', params],
    () => getStreams(params),
    options,
  );
}
