import { parseTimestamp, formatTimestampToString } from './timestampFormatter';

type Block = {
  index: number;
  startTime: string;
  startTimestamp: number;
  endTime: string;
  endTimestamp: number;
  highlightScore: string;
  topPercentage: string;
}

/**
 * 문자열 srt파일을 Block[]객체로 반환
 * @param srtStr srt파일 문자열 형태
 * @returns 
 */
export function parseSRT(srtStr: string): Block[] {
  const blocks = srtStr.split('\n\n').slice(1);
  return blocks.map((block) => {
    const [index, times, text] = block.split('\n');
    const [startTime, endTime] = times.split(' --> ');

    return {
      index: Number(index),
      startTime,
      startTimestamp: parseTimestamp(startTime),
      endTime,
      endTimestamp: parseTimestamp(endTime),
      highlightScore: '',
      topPercentage: text,
    };
  });
}

/**
 * 문자열 csv 파일을 Block[]객체로 반환
 * @param csvStr csv 파일 문자열 
 * @returns 
 */
export function parseCSV(csvStr: string): Block[] {
  return csvStr.split('\n').map((block) => {
    const [index, startTime, endTime, highlightScore, topPercentage] = block.split(',');
    return {
      index,
      startTime,
      endTime,
      highlightScore,
      topPercentage,
    };
  }).filter((block) => block.index)
    .map((block) => {
      const {
        index, startTime, endTime, highlightScore, topPercentage,
      } = block;
      return {
        index: Number(index),
        startTime,
        startTimestamp: parseTimestamp(`${startTime},000`),
        endTime,
        endTimestamp: parseTimestamp(`${endTime},000`),
        highlightScore,
        topPercentage,
      };
    });
}

/**
 * 파일 확장자에 따라 문자열 파일을 파싱하여 Block[] 객체형태로 반환
 * @param strData 문자열 파일 데이터
 * @param ext 파일 확장자
 * @returns 
 */
export function parseString(strData: string, ext: 'srt'|'csv'): Block[] {
  let parsed;
  if (ext === 'srt') {
    parsed = parseSRT(strData);
  } else if (ext === 'csv') {
    parsed = parseCSV(strData);
  }

  return parsed;
}

/**
 * Block[] 형태의 객체를 입력받아
 * 부분영상 시작시간만큼 시간 빼서 반환
 * @param parsed 
 * @param editTime 부분영상 시작시간
 * @returns 
 */
export function modify(parsed: Block[], editTime: string): Block[] {
  const match = editTime.match(/^(?:(\d{1,}):)?(\d{2}):(\d{2})[,.](\d{3})$/);

  if (!match) {
    throw new Error(`Invalid SRT time format: "${editTime}"`);
  }
  const editTimestamp = parseTimestamp(editTime);

  const filtered = parsed.filter((block) => block.endTimestamp > editTimestamp);
  const resynced = filtered.map((block, index) => {
    const resyncedStartTimestamp = block.startTimestamp - editTimestamp;
    const resyncedEndTimestamp = block.endTimestamp - editTimestamp;
    return ({
      ...block,
      index,
      startTime: formatTimestampToString(resyncedStartTimestamp),
      endTime: formatTimestampToString(resyncedEndTimestamp),
      startTimestamp: Math.max(resyncedStartTimestamp, 0),
      endTimestamp: Math.max(resyncedEndTimestamp, 0),
    });
  });

  return resynced;
}

/**
 * Block[] 형태의 데이터를 문자열 srt파일로 반환
 * @param parsed 
 * @returns 
 */
export function stringifySRT(parsed: Block[]): string {
  const blockList = parsed.map((block) => {
    const {
      index, startTime, endTime, topPercentage,
    } = block;
    const timesStr = `${startTime} ---> ${endTime}`;
    return [index + 2, timesStr, topPercentage].join('\n'); // 첫번째 블럭은 트루포인트 편집점이 들어감
  });
  const metaBlock = [1, '00:00:00,000 --> 00:00:01,000', '★Truepoint★ 편집점'].join('\n');
  return [metaBlock, ...blockList].join('\n\n');
}

/**
 * Block[] 형태의 데이터를 문자열 csv파일로 반환
 * @param parsed 
 * @returns 
 */
export function stringifyCSV(parsed: Block[]): string {
  const blockList = parsed.map((block) => {
    const {
      index, startTime, endTime, highlightScore, topPercentage,
    } = block;
    return [index, startTime, endTime, highlightScore, topPercentage].join(',');
  });
  const metaBlock = ['', 'START TIME', 'END TIME', 'HIGHLIGHT SCORE', 'TOP 3%'].join(',');
  return [metaBlock, ...blockList].join('\n');
}

/**
 * Block[]형태로 파싱된 데이터를 srt|csv 파일 문자열 형태로 반환
 * @param parsed 
 * @param ext 파일확장자
 * @returns 
 */
export function stringify(parsed: Block[], ext: 'srt'|'csv'): string {
  if (ext === 'srt') {
    return stringifySRT(parsed);
  } if (ext === 'csv') {
    return stringifyCSV(parsed);
  }
  throw new Error(`extention accepts only 'srt', 'csv' \n invalid ext : ${ext}`);
}

// s3 파일 키에서 확장자 찾아서 해당 파일의 확장자 반환
export function getExtention(key: string): 'srt'|'csv' {
  let ext;
  if (key.includes('srt')) {
    ext = 'srt';
  } else if (key.includes('csv')) {
    ext = 'csv';
  }
  if (!ext) {
    throw new Error('key must include srt or csv');
  }
  return ext;
}

/**
 * 편집점 파일데이터를 입력된 시작시간에 따라 잘라내어
 * 문자열형태로 반환
*/
export function cutFile({
  key, fileData, startTime,
}: {
  key: string,
  fileData: string,
  startTime: string
}): string {
  const ext = getExtention(key);
  const parsed = parseString(fileData, ext);
  const modified = modify(parsed, startTime);
  const resultStr = stringify(modified, ext);
  return resultStr;
}
