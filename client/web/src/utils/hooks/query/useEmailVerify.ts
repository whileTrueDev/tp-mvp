import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';

// 이메일 주소로 코드 보내기 요청
async function sendEmailCode(email: string) {
  const { data } = await axios.get('/auth/email/code', {
    params: { email },
  });
  return data;
}

export function useSendEmailQuery(
  email: string,
  options?: UseQueryOptions<boolean, AxiosError>,
): UseQueryResult<boolean, AxiosError> {
  return useQuery(
    ['sendEmailCode', email],
    () => sendEmailCode(email),
    options,
  );
}

type VerifyEmailParam = {
  email: string,
  code: string
}
// 이메일 인증코드 유효한지 확인요청
async function verifyEmailCode(params: VerifyEmailParam) {
  const { data } = await axios.get('/auth/email/code/verify', {
    params,
  });
  return data;
}

export function useVerifyCodeQuery(
  params: VerifyEmailParam,
  options?: UseQueryOptions<boolean, AxiosError>,
): UseQueryResult<boolean, AxiosError> {
  return useQuery(
    ['emailCodeVerification', params],
    () => verifyEmailCode(params),
    options,
  );
}
