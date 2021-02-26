import { Address6 } from 'ip-address';

// ip주소가 ipv6으로 들어오는데ipv4 로 address family 바꾸는 방법 못찾아서
// ipv6주소를 ipv4로 변환하는 함수
export function ipv6ToIpv4(ipv6: string): string {
  const address = new Address6(ipv6);
  const teredo = address.inspectTeredo();
  const ipv4 = teredo.client4; // 255.255.255.254

  const ipToSave = ipv4.split('.').slice(0, 2).join('.');// 255.255 처럼 잘라서 저장
  return ipToSave;
}
