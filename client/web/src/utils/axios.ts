import Axios from 'axios';

function getApiHost(): string {
  let apihost = '';

  switch (process.env.REACT_APP_NODE_ENV) {
    case 'test':
      apihost = 'https://test-api.mytruepoint.com';
      break;
    case 'production':
      apihost = 'https://api.mytruepoint.com';
      break;
    case 'development':
    default:
      apihost = 'http://localhost:3000';
      break;
  }
  return apihost;
}

const axios = Axios.create({
  baseURL: getApiHost(),
  withCredentials: true,
});

export default axios;
