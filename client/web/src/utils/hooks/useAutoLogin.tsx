import React from 'react';
import axios from '../axios';

/* eslint-disable react-hooks/exhaustive-deps */
export default function useAutoLogin(
  userId: any, handleLogin: (s: string) => void
): void {
  // *******************************************
  // 자동로그인 체크하여 유효한 refresh token이 있는 경우 자동 로그인
  React.useLayoutEffect(() => {
    if (!userId) {
      console.log('refreshing!...');
      axios.post('/auth/silent-refresh')
        .then((res) => {
          if (res.data) {
            handleLogin(res.data.access_token);
            console.log('refreshed!...');
            // login, signup, find-id, find-pw인 경우 메인페이지로 이동
            if (['/login', '/signup', 'find-id', 'find-pw']
              .includes(window.location.pathname)) {
              window.location.href = '/';
            }
          }
        })
        .catch((err) => {
          if (err.status === 400
               || (err.response && err.response.status === 400)) {
            if (window.location.pathname !== '/') {
              window.location.href = '/';
            }
          } else {
            console.log(err.response);
            return Promise.reject(err);
          }
          return Promise.reject(err);
        });
    }
  }, []); // Should be run only once!!
}
/* eslint-enable react-hooks/exhaustive-deps */
