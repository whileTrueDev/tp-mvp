import { AxiosResponse, AxiosError } from 'axios';
import axios from '../axios';
// *******************************************
// Axios Configurations

// Response Interceptors
export function onResponseFulfilled(request: AxiosResponse): AxiosResponse {
  return request;
}

export function makeResponseRejectedHandler(
  handleLogin: (token:string) => void
): (err: AxiosError) => any {
  function onResponseRejected(err: AxiosError): any {
    if (err.response && err.response.status === 401) {
      // Unauthorized Error 인 경우
      return axios.post('/auth/silent-refresh')
        .then((res) => {
          const token = res.data.access_token;
          // React Context 변경
          handleLogin(token);
          // 실패 요청을 재 요청
          const failedRequest = err.config;
          failedRequest.headers['cache-control'] = 'no-cache';
          return axios(failedRequest);
        })
        .catch(() => {
          window.location.href = '/';
          return Promise.reject(err); // 로그인으로 강제 이동
        });
    }
    return Promise.reject(err);
  }
  return onResponseRejected;
}
