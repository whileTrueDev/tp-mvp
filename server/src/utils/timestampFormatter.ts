export const padLeft = (value: number, length = 2): string => value.toString().padStart(length, '0');

/**
 * 'hh:mm:ss,sss' 형태의 문자열을 밀리세컨드로 출력
 * @param timestamp 'hh:mm:ss,sss'
 * @returns 밀리세컨드
 */
export function parseTimestamp(timestamp: string): number {
  const match = timestamp.match(/^(?:(\d{1,}):)?(\d{2}):(\d{2})[,.](\d{3})$/);

  if (!match) {
    throw new Error(`Invalid SRT time format: "${timestamp}"`);
  }

  const hours = match[1] ? parseInt(match[1], 10) * 60 * 60 * 1000 : 0;
  const minutes = parseInt(match[2], 10) * 60 * 1000;
  const seconds = parseInt(match[3], 10) * 1000;
  const milliseconds = parseInt(match[4], 10);

  return hours + minutes + seconds + milliseconds;
}

/**
 * 밀리세컨드로 입력된 시간을 'hh:mm:ss,sss'형태의 문자열로 출력
 * @param timestamp 밀리세컨드
 * @returns 
 */
export function formatTimestampToString(timestamp: number): any {
  if (timestamp < 0) {
    return '00:00:00,000';
  }
  const hours = Math.floor(timestamp / 60 / 60 / 1000);
  const hoursInMillisec = hours * 60 * 60 * 1000;

  const minutes = Math.floor((timestamp - hoursInMillisec) / 60 / 1000);
  const minutesInMillisec = minutes * 60 * 1000;

  const seconds = Math.floor((timestamp - hoursInMillisec - minutesInMillisec) / 1000);

  const formatted = `${padLeft(hours)}:${padLeft(minutes)}:${padLeft(seconds)},000`;

  return formatted;
}
