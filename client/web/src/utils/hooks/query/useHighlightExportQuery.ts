import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type ExportParams = {
  creatorId: string,
  platform: 'afreeca'|'youtube'|'twitch',
  streamId: string,
  exportCategory: string,
  srt: number,
  csv: number,
  startTime: string,
}

async function exportHighlightFile(params: ExportParams) {
  const { data } = await axios.get('/highlight/export', {
    responseType: 'blob',
    params,
  });
  return data;
}

export function useExportHighlightQuery(
  params: ExportParams,
  options?: UseQueryOptions<any, AxiosError>,
): UseQueryResult<any, AxiosError> {
  return useQuery(
    ['exportHighlight', params],
    () => exportHighlightFile(params),
    options,
  );
}
