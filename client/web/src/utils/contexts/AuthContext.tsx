import React from 'react';
import jwtDecode from 'jwt-decode';
import useAxios from 'axios-hooks';
import { LoginUser } from '../../interfaces/LoginUser';
import axios from '../axios';

export interface LoginRequestUserInfo {
  userId: string;
  password: string;
}
export interface AuthContextValue {
  user: LoginUser;
  accessToken?: string;
  handleLogin: (accessToken: string) => void;
  handleLogout: () => void;
}

const defaultUserValue = {
  userId: '', userDI: '', userName: '', roles: '',
};
const AuthContext = React.createContext<AuthContextValue>({
  user: defaultUserValue,
  accessToken: '',
  /* eslint-disable @typescript-eslint/no-empty-function */
  handleLogin: () => {},
  handleLogout: () => {},
  /* eslint-enable @typescript-eslint/no-empty-function */
});

export function useLogin(): AuthContextValue {
  const [user, setUser] = React.useState<LoginUser>(defaultUserValue);
  const [accessTokenState, setAccessToken] = React.useState<string>();

  function handleLogin(accessToken: string): void {
    setAccessToken(accessToken);
    const u = jwtDecode<LoginUser>(accessToken);
    setUser(u);

    // 받아온 accessToken을 axios 기본 헤더로 설정
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }

  // 로그아웃 요청으로 서버 DB에 적재된 refresh token을 삭제.
  const [, doPostRequest] = useAxios({
    url: '/auth/logout', method: 'POST',
  }, { manual: true });

  function handleLogout(): void{
    setAccessToken(undefined);
    setUser(defaultUserValue);
    // 백엔드 요청
    doPostRequest({ data: { userId: user.userId } })
      .then((res) => {
        if (res.data && res.data.success) {
          window.location.href = '/';
        }
      })
      .catch((err) => {
        // 올바르게 로그아웃되지 않음.
        console.error(err);
        window.location.href = '/';
      });
  }

  return {
    user,
    accessToken: accessTokenState,
    handleLogin,
    handleLogout,
  };
}

export default AuthContext;
