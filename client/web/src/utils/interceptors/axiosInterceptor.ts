import { AxiosResponse, AxiosError } from 'axios';
import axios from '../axios';
// *******************************************
// Axios Configurations

// Response Interceptors
export function onResponseFulfilled(request: AxiosResponse): AxiosResponse {
  return request;
}

// 에러 반환받았을 때의 Response interceptor
export function makeResponseRejectedHandler(
  handleLogin: (token: string) => void,
  handleLoginLoadingStart: () => void,
  handleLoginLoadingEnd: () => void,
): (err: AxiosError) => any {
  function onResponseRejected(err: AxiosError): any {
    if (err.response && err.response.status === 401) {
      // Unauthorized Error 인 경우

      // 로그인 로딩 start
      handleLoginLoadingStart();

      return axios.post('/auth/silent-refresh')
        .then((res) => {
          const token = res.data.access_token;
          // React Context 변경
          handleLogin(token);

          // 실패 요청을 재 요청
          const failedRequest = err.config;
          failedRequest.headers['cache-control'] = 'no-cache';

          // 로그인 로딩 end
          handleLoginLoadingEnd();

          return axios(failedRequest)
            .catch((reRequestErr) => {
              Promise.reject(reRequestErr);
            });
        })
        .catch((refreshError) => {
          // 로그인 로딩 end
          handleLoginLoadingEnd();

          // refresh token이 만료되어 새로운 토큰을 발급하지 못하여,
          // 새로운 로그인이 필요하므로 메인페이지 or login 페이지 로 이동
          if (window.location.pathname !== '/') {
            window.location.href = '/';
          }

          Promise.reject(refreshError); // 로그인으로 강제 이동
        });
    }
    return Promise.reject(err);
  }
  return onResponseRejected;
}
