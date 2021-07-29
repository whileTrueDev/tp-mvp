import transformIdToAsterisk from './transformAsterisk';

const nicknameBlacklist = [
  '관리자',
  'truepoint',
];

export const UNAVAILABLE_NICKNAME_ERROR_MESSAGE = '사용할 수 없는 닉네임입니다. 다른 닉네임을 입력해주세요.';

/**
 * 닉네임이 블랙리스트에 해당되면 false 반환(사용 불가 닉네임)
 */
export function isAvailableNickname(nick: string): boolean {
  const trimmedLowercase = nick.replace(/ /g, '').toLowerCase();
  return !nicknameBlacklist.includes(trimmedLowercase);
}

export function throwErrorIfNicknameOnBlacklist(nick: string): never | void {
  if (!isAvailableNickname(nick)) {
    throw new Error(UNAVAILABLE_NICKNAME_ERROR_MESSAGE);
  }
}

/**
 * userId가 있는 경우 
 *  "닉네임 (아이디**)"" 형태로 표시
 * userId가 없는 경우
 *  "닉네임" 만 표시
 */
export function displayNickname(userId: string | undefined, nickname: string): string {
  if (!userId) return nickname;
  return (userId !== 'Truepoint')
    ? `${nickname} (${transformIdToAsterisk(userId)})`
    : nickname;
}
