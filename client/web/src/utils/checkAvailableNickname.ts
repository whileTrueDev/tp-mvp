const nicknameBlackList = [
  '관리자',
  'truepoint',
];

export function isAvailableNickname(nick: string): boolean {
  const trimmedLowercase = nick.replace(/ /g, '').toLowerCase();
  const includedInBlackList = nicknameBlackList.includes(trimmedLowercase);
  return !includedInBlackList;
}
