import axios from 'axios';
import getApiHost from './getApiHost';

const axiosInstance = axios.create({
  baseURL: getApiHost(),
  withCredentials: true,
});

export default axiosInstance;
