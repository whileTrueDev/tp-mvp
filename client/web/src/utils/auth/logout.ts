import SESSION_STORAGE_LOGIN_KEY from './constants';

export default function logout(): void {
  window.sessionStorage.removeItem(SESSION_STORAGE_LOGIN_KEY);
}
