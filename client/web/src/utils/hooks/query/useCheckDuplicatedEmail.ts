import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';

async function checkEmailDuplicate(email: string) {
  const { data } = await axios.get('/users/check-email', {
    params: { email },
  });
  return data;
}

export function useCheckEmailDuplicate(
  email: string,
  options?: UseQueryOptions<boolean, AxiosError>,
): UseQueryResult<boolean, AxiosError> {
  return useQuery(
    ['checkEmailDuplicate', email],
    () => checkEmailDuplicate(email),
    options,
  );
}
