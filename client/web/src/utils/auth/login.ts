import SESSION_STORAGE_LOGIN_KEY from './constants';

export default function login(accessToken: string): void {
  window.sessionStorage.setItem(SESSION_STORAGE_LOGIN_KEY, accessToken);
}
