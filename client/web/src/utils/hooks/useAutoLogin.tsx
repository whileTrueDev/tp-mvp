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
    if (!userId) { // userId 가 없을때(userId === '') refresh token확인
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
            if (['/login', '/signup', '/find-id', '/find-pw', '/signup/completed']
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
            console.error('invalid or expired refresh token');
            if (window.location.pathname.includes('/mypage')) {
              alert('재로그인이 필요합니다. 다시 로그인 해주세요.');
              window.location.href = '/login';
            }

            return Promise.reject(err);
          }
          return Promise.reject(err);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Should be run only once!!
}
