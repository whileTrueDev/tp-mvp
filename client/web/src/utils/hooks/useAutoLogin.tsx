import React from 'react';
import axios from '../axios';

export default function useAutoLogin(
  userId: string | undefined,
  handleLogin: (s: string) => void,
  handleLoginLoadingStart: () => void,
  handleLoginLoadingEnd: () => void,
): void {
  // *******************************************
  // 자동로그인 체크하여 유효한 refresh token이 있는 경우 자동 로그인
  React.useLayoutEffect(() => {
    if (!userId) {
      // console.log('refreshing!...');

      // 로그인 로딩 start
      handleLoginLoadingStart();
      axios.post('/auth/silent-refresh')
        .then((res) => {
          if (res.data) {
            handleLogin(res.data.access_token);

            // 로그인 로딩 start
            handleLoginLoadingEnd();

            // login, signup, find-id, find-pw인 경우 메인페이지로 이동
            if (['/login', '/signup', 'find-id', 'find-pw', '/signup/completed']
              .includes(window.location.pathname)) {
              window.location.href = '/';
            }
          }
        })
        .catch((err) => {
          handleLoginLoadingEnd();
          // 로그인 로딩 end
          if (err.response && err.response.status === 400) {
            // refresh token이 유효하지 않은 경우. (시간이 지난 리프레시 토큰)
            if (window.location.pathname !== '/') {
              if (!(window.location.pathname === '/infoCBT') // CBT 페이지가 아닌 경우 &&  게시판 페이지가 아닌 경우 메인페이지로 옮겨짐.
                  && !(window.location.pathname.includes('/community-board'))) {
                window.location.href = '/';
              }
            }
            return Promise.reject(err);
          }
          return Promise.reject(err);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Should be run only once!!
}
