import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type SoundFileExportParams = {
  streamId: string,
  platform: 'afreeca' | 'youtube' | 'twitch',
  creatorId: string,
  exportCategory: string
}

async function downloadSoundFile(params: SoundFileExportParams) {
  const { data } = await axios.get('/highlight/full-sound-file', {
    responseType: 'blob',
    params,
  });
  return data;
}

export function useSoundFileExportQuery(
  params: SoundFileExportParams,
  options?: UseQueryOptions<any, AxiosError>,
): UseQueryResult<any, AxiosError> {
  return useQuery(
    ['exportSoundFile', params],
    () => downloadSoundFile(params),
    options,
  );
}
