import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';

type Params = {
  email: string;
  code: string;
}
async function checkValidEmailCode(params: Params) {
  const { data } = await axios.get('/auth/email/code/verify', {
    params,
  });
  return data;
}

export function useCheckValidEmailCode(
  params: Params,
  options?: UseQueryOptions<boolean, AxiosError>,
): UseQueryResult<boolean, AxiosError> {
  return useQuery(
    ['checkValidEmailCode', params],
    () => checkValidEmailCode(params),
    options,
  );
}
