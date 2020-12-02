export default function getFrontHost(): string {
  let fronthost = '';

  switch (process.env.NODE_ENV) {
    case 'test':
      fronthost = 'https://test-admin.mytruepoint.com';
      break;
    case 'production':
      fronthost = 'https://admin.mytruepoint.com';
      break;
    case 'development':
    default:
      fronthost = 'http://localhost:3002';
      break;
  }
  return fronthost;
}
