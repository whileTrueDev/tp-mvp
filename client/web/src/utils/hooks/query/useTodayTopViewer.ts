import { TodayTopViewerUsersRes } from '@truepoint/shared/dist/res/TodayTopViewerUsersRes.interface';
import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';

async function getTodayTopViewer() {
  const { data } = await axios.get('/broadcast-info/today-top-viewer');
  return data;
}

export function useTodayTopViewer(
  options?: UseQueryOptions<TodayTopViewerUsersRes, AxiosError>,
): UseQueryResult<TodayTopViewerUsersRes, AxiosError> {
  return useQuery(['todayTopViewerCreator'], getTodayTopViewer, options);
}
