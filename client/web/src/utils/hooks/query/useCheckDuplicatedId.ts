import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';

async function checkIdDuplicate(userId: string) {
  const { data } = await axios.get('/users/check-id', {
    params: { userId },
  });
  return data;
}

export function useCheckIdDuplicate(
  userId: string,
  options?: UseQueryOptions<boolean, AxiosError>,
): UseQueryResult<boolean, AxiosError> {
  return useQuery(
    ['checkIdDuplicate', userId],
    () => checkIdDuplicate(userId),
    options,
  );
}
