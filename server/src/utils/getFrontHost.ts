export default function getFrontHost(): string {
  let fronthost = '';

  switch (process.env.NODE_ENV) {
    case 'test':
      fronthost = 'https://test.mytruepoint.com';
      break;
    case 'production':
      fronthost = 'https://mytruepoint.com';
      break;
    case 'development':
    default:
      fronthost = 'http://localhost:3001';
      break;
  }
  return fronthost;
}
