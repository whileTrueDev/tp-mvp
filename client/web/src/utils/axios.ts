import Axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import SESSION_STORAGE_LOGIN_KEY from './auth/constants';
import login from './auth/login';

// configures

const axios = Axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
});

// *******************************************
// Request Interceptors
function onRequestFulfilled(config: AxiosRequestConfig): AxiosRequestConfig {
  const newConfig = config;
  newConfig.headers.Authorization = `Bearer ${sessionStorage.getItem(SESSION_STORAGE_LOGIN_KEY)}`;
  return newConfig;
}

axios.interceptors.request.use(
  onRequestFulfilled, (error) => Promise.reject(error)
);

// *******************************************
// Response Interceptors
function onResponseFulfilled(request: AxiosResponse): AxiosResponse {
  return request;
}
function onResponseRejected(err: AxiosError): any {
  if (err.response && err.response.status === 401) {
    // Unauthorized Error 인 경우
    return axios.post('http://localhost:3000/auth/silent-refresh')
      .then((res) => {
        const token = res.data.access_token;
        login(token);
      })
      .catch((error) => {
        window.location.href = '/login';
      });
  }
  return err;
}

axios.interceptors.response.use(
  onResponseFulfilled, onResponseRejected
);

export default axios;
