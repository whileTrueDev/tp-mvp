export default process.env.NODE_ENV === 'production'
  ? 'https://api.mytruepoint.com'
  : 'http://localhost:3000';
