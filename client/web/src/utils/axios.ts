import Axios, { AxiosResponse, AxiosError } from 'axios';

// configures

const axios = Axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
});

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
        // 새로받은 access token을 axios 기본 헤더로 설정
        axios.defaults.headers.Authorization = `Bearer ${token}`;
        return axios(err.config);
      })
      .catch((error) => {
        window.location.href = '/login';
      });
  }
  return Promise.reject(err);
}

axios.interceptors.response.use(
  onResponseFulfilled, onResponseRejected
);

export default axios;
