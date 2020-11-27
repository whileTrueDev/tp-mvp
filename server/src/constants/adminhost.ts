export default process.env.NODE_ENV === 'production'
  ? 'https://admin.mytruepoint.com'
  : 'http://localhost:3002';
