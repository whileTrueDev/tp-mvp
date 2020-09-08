export default function transformIdToAsterisk(str: string):string {
  const asteriskedUserId = str
    .substring(0, str.length - 4)
    .concat('****');
  return asteriskedUserId;
}
