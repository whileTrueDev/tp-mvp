  
import axios from 'axios';

const axiosInstance = axios.create({
  withCredentials: false,
});

export default axiosInstance;
