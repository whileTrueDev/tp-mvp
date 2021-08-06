import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type CheckUserExistParam = {
  id: string;
  email: string;
}
async function checkUserExist(params: CheckUserExistParam) {
  const { data } = await axios.get('/users/check-exist-user', { params });
  return data;
}

export function useCheckUserExist(
  params: CheckUserExistParam,
  options?: UseQueryOptions<boolean, AxiosError>,
): UseQueryResult<boolean, AxiosError> {
  return useQuery(
    ['checkUserExist', params],
    () => checkUserExist(params),
    options,
  );
}
