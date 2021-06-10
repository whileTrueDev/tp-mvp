import { useState, useLayoutEffect } from 'react';
import useAuthContext from './useAuthContext';

export default function useTokenRefreshLoading(): {loadingOpen: boolean} {
  /**
   * ************************************************
   * 토큰리프레시 로딩 컴포넌트 Open을 위한 작업
   */
  const auth = useAuthContext();
  const [loadingOpen, setLoadingOpen] = useState(auth.loginLoading === true || !auth.user.userId);
  useLayoutEffect(() => {
    const maxTimeout = 2 * 1000; // 2초
    if (!(!auth.loginLoading && auth.user.userId)) {
      setLoadingOpen(true);
    }

    const timer = setTimeout(() => {
      // 로딩이 끝났고, 유저 ID가 있는 경우(토큰이 있는 경우)
      if (!auth.loginLoading && auth.user.userId && auth.accessToken) setLoadingOpen(false);
      // 최대 타임아웃 이후에도 로딩이 끝나지 않았거나 액세스 토큰이 없는 경우 
      else window.location.href = '/login';
    }, maxTimeout);
    return () => clearTimeout(timer);
  }, [auth.accessToken, auth.loginLoading, auth.user.userId]);
  // *************************************************
  return { loadingOpen };
}
