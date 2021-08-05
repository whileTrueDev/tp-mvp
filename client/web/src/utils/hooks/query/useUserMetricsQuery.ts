import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { UserMetrics } from '../../../interfaces/UserMetrics';
import axios from '../../axios';

async function getUserMetrics(userId: string) {
  const { data } = await axios.get('/stream-analysis/user-statistics', {
    params: { userId },
  });
  return data;
}

export function useUserMetricsQuery(
  userId: string,
  options?: UseQueryOptions<UserMetrics[], AxiosError>,
): UseQueryResult<UserMetrics[], AxiosError> {
  return useQuery(
    ['userMetrics', userId],
    () => getUserMetrics(userId),
    options,
  );
}
