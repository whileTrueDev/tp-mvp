const nicknameBlackist = [
  '관리자',
  'truepoint',
];

export const UNAVAILABLE_NICKNAME_ERROR_MESSAGE = '사용할 수 없는 닉네임입니다. 다른 닉네임을 입력해주세요.';

export function isAvailableNickname(nick: string): boolean {
  const trimmedLowercase = nick.replace(/ /g, '').toLowerCase();
  const includedInBlackList = nicknameBlackist.includes(trimmedLowercase);
  return !includedInBlackList;
}

export function throwErrorIfNicknameOnBlacklist(nick: string): never | void {
  if (!isAvailableNickname(nick)) {
    throw new Error(UNAVAILABLE_NICKNAME_ERROR_MESSAGE);
  }
}
