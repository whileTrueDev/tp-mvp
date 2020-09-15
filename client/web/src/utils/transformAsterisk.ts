export default function transformIdToAsterisk(str: string):string {
  const howMany = Math.floor(str.length / 2.5);

  let asterisk = '';
  for (let i = 0; i < howMany; i += 1) {
    asterisk = asterisk.concat('*');
  }
  const asteriskedUserId = str
    .substring(0, str.length - howMany)
    .concat(asterisk);
  return asteriskedUserId;
}
