import SESSION_STORAGE_LOGIN_KEY from './constants';

export default function login(accessToken: string): void {
  window.sessionStorage.setItem(SESSION_STORAGE_LOGIN_KEY, accessToken);
  // 메모리에 저장 not session storage
}
