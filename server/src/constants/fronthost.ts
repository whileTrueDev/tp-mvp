export default process.env.NODE_ENV === 'production'
  ? 'https://mytruepoint.com'
  : 'http://localhost:3001';
