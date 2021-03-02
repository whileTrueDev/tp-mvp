import { Address6 } from 'ip-address';

/**
 * response.ip가 ipv6으로 들어오는데
 * ipv4 로 address family 바꾸는 방법 못찾아서
 * ipv6주소를 ipv4로 변환하는 함수
 * 
 * @param ipv6 ipv6 형태의 문자열 
 * 2001:0db8:85a3:0000:0000:8a2e:0370:7334
 * 
 * @return ipv4 형태의 문자열
 * 예시) 192.88.99.255
 */
export function convertIpv6ToTo4(ipv6: string): string {
  const address = new Address6(ipv6);
  const teredo = address.inspectTeredo();
  return teredo.client4; // 255.255.255.254
}

/**
 * 자유게시판에서 ip 저장시 ipv4주소를 반 잘라서 db에 저장할때 사용
 * @param ipv6 
 * @return ip주소v4 를 반 자른 문자열
 * 예시) 192.88
 */
export function GetIpv4Half(ipv6: string): string {
  const ipv4ToSave = convertIpv6ToTo4(ipv6)
    .split('.')
    .slice(0, 2)
    .join('.');// 255.255 처럼 잘라서 저장
  return ipv4ToSave;
}
