import React from 'react';
import jwtDecode from 'jwt-decode';
import { LoginUser } from '../../interfaces/LoginUser';
import axios from '../axios';
import useAutoLogin from '../hooks/useAutoLogin';
import { onResponseFulfilled, makeResponseRejectedHandler } from '../interceptors/axiosInterceptor';
import { useLogoutQuery } from '../hooks/mutation/useLogoutQuery';

export interface LoginRequestUserInfo {
  userId: string;
  password: string;
}
export interface AuthContextValue {
  user: LoginUser;
  accessToken?: string;
  handleLogin: (accessToken: string) => Promise<void>;
  handleLogout: () => void;
  loginLoading: boolean;
  handleLoginLoadingStart: () => void;
  handleLoginLoadingEnd: () => void;
  setUser: React.Dispatch<React.SetStateAction<LoginUser>>;
}

const defaultUserValue = {
  userId: '', userDI: '', userName: '', roles: '', nickName: '',
};
const AuthContext = React.createContext<AuthContextValue>({
  user: defaultUserValue,
  accessToken: '',
  /* eslint-disable @typescript-eslint/no-empty-function */
  handleLogin: async () => {},
  handleLogout: () => {},
  loginLoading: false,
  handleLoginLoadingStart: () => {},
  handleLoginLoadingEnd: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUser: () => {},
});

export function useLogin(): AuthContextValue {
  const [user, setUser] = React.useState<LoginUser>(defaultUserValue);
  const [loginLoading, setLoginLoading] = React.useState<boolean>(false);
  const [accessTokenState, setAccessToken] = React.useState<string>();
  async function handleLogin(accessToken: string): Promise<void> {
    setAccessToken(accessToken);
    const u = jwtDecode<LoginUser>(accessToken);
    const userData = await axios.get('/users', { params: { userId: u.userId } });
    const { profileImage, mail, provider } = userData.data;
    setUser({
      ...u, profileImage, mail, provider,
    });

    // 받아온 accessToken을 axios 기본 헤더로 설정
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }

  const { mutateAsync: logout } = useLogoutQuery();

  function handleLogout(): void {
    setAccessToken(undefined);
    setUser(defaultUserValue);
    // 백엔드 요청
    // 로그아웃 요청으로 서버 DB에 적재된 refresh token을 삭제.
    logout({ userId: user.userId })
      .then((res) => {
        if (res && res.success) {
          window.location.href = '/';
        }
      })
      .catch((err) => {
        // 올바르게 로그아웃되지 않음.
        console.error(err);
        window.location.href = '/';
      });
  }

  // 로딩 제어 함수
  function handleLoginLoadingStart() {
    setLoginLoading(true);
  }
  function handleLoginLoadingEnd() {
    setLoginLoading(false);
  }

  return {
    user,
    accessToken: accessTokenState,
    handleLogin,
    handleLogout,
    loginLoading,
    handleLoginLoadingStart,
    handleLoginLoadingEnd,
    setUser,
  };
}

export default AuthContext;

export function AuthContextProvider({ children }: {
  children: React.ReactNode
}): JSX.Element {
  // *******************************************
  // 로그인 관련 변수 및 함수 세트 가져오기
  const {
    user, accessToken, handleLogout, handleLogin,
    loginLoading, handleLoginLoadingStart, handleLoginLoadingEnd, setUser,
  } = useLogin();
    // *******************************************
  // 토큰 자동 새로고침을 위한 인터셉터 설정
  axios.interceptors.response.use(
    onResponseFulfilled,
    makeResponseRejectedHandler(handleLogin, handleLoginLoadingStart, handleLoginLoadingEnd),
  );
  // *******************************************
  // 자동로그인 훅. 반환값 없음. 해당 함수는 useLayoutEffect 만을 포함함.
  useAutoLogin(user.userId, handleLogin, handleLoginLoadingStart, handleLoginLoadingEnd);

  return (
    <AuthContext.Provider value={{
      user,
      accessToken,
      handleLogin,
      handleLogout,
      loginLoading,
      handleLoginLoadingStart,
      handleLoginLoadingEnd,
      setUser,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}
