import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://api.mytruepoint.com' : 'http://localhost:3000',
  withCredentials: true,
});

export default axios;
