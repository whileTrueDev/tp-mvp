import Axios from 'axios';
import { getApiHost } from './getApiHost';

const axios = Axios.create({
  baseURL: getApiHost(),
  withCredentials: true,
});

export default axios;
