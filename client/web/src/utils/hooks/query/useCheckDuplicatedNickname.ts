import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';

async function checkNicknameDuplicate(nickname: string) {
  const { data } = await axios.get('/users/check-nickname', {
    params: { nickname },
  });
  return data;
}

export function useCheckNicknameDuplicate(
  nickname: string,
  options?: UseQueryOptions<boolean, AxiosError>,
): UseQueryResult<boolean, AxiosError> {
  return useQuery(
    ['checkNicknameDuplicate', nickname],
    () => checkNicknameDuplicate(nickname),
    options,
  );
}
