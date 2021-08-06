import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';
import { CheckUserExistParam } from './useCheckUserExist';

// 이메일 주소로 코드 보내기 요청
async function sendTemporaryPasswordEmail(params: CheckUserExistParam) {
  const { data } = await axios.get('/auth/email/temporary-password', { params });
  return data;
}

export function useTemporaryPasswordEmail(
  params: CheckUserExistParam,
  options?: UseQueryOptions<boolean, AxiosError>,
): UseQueryResult<boolean, AxiosError> {
  return useQuery(
    ['sendTemporaryPasswordEmail', params],
    () => sendTemporaryPasswordEmail(params),
    options,
  );
}
