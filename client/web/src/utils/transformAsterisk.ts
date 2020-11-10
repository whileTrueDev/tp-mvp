/**
 * 문자열 마스킹 처리 함수
 * @param str 마스킹처리할 문자열
 * @param degree 마스킹 강도. float으로, 1에 가까울수록 **처리가 많아진다.
 * @author hwasurr|dan
 */
export default function transformIdToAsterisk(str: string, degree = 2.5): string {
  const howMany = Math.floor(str.length / degree);

  let asterisk = '';
  for (let i = 0; i < howMany; i += 1) {
    asterisk = asterisk.concat('*');
  }
  const asteriskedUserId = str
    .substring(0, str.length - howMany)
    .concat(asterisk);
  return asteriskedUserId;
}
