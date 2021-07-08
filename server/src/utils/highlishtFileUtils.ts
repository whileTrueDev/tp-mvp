export function parseTimestamp(timestamp: string): number {
  const match = timestamp.match(/^(?:(\d{1,}):)?(\d{2}):(\d{2})[,.](\d{3})$/);

  if (!match) {
    throw new Error(`Invalid SRT or VTT time format: "${timestamp}"`);
  }

  const hours = match[1] ? parseInt(match[1], 10) * 3600000 : 0;
  const minutes = parseInt(match[2], 10) * 60000;
  const seconds = parseInt(match[3], 10) * 1000;
  const milliseconds = parseInt(match[4], 10);

  return hours + minutes + seconds + milliseconds;
}

export function formatTimestampToString(timestamp: number): any {
  if (timestamp < 0) {
    return '00:00:00,000';
  }
  const hours = Math.floor(timestamp / 60 / 60 / 1000);
  const hoursInMillisec = hours * 60 * 60 * 1000;

  const minutes = Math.floor((timestamp - hoursInMillisec) / 60 / 1000);
  const minutesInMillisec = minutes * 60 * 1000;

  const seconds = Math.floor((timestamp - hoursInMillisec - minutesInMillisec) / 1000);

  const formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},000`;

  return formatted;
}

type Block = {
  index: number;
  startTime: string;
  startTimestamp: number;
  endTime: string;
  endTimestamp: number;
  highlightScore: string;
  topPercentage: string;
}

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

export function parseString(strData: string, ext: 'srt'|'csv'): Block[] {
  let parsed;
  if (ext === 'srt') {
    parsed = parseSRT(strData);
  } else if (ext === 'csv') {
    parsed = parseCSV(strData);
  }

  return parsed;
}

export function modify(parsed: Block[], editTime: string): Block[] {
  const match = editTime.match(/^(?:(\d{1,}):)?(\d{2}):(\d{2})[,.](\d{3})$/);

  if (!match) {
    throw new Error(`Invalid SRT or VTT time format: "${editTime}"`);
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

export function stringify(parsed: Block[], ext: 'srt'|'csv'): string {
  if (ext === 'srt') {
    return stringifySRT(parsed);
  } if (ext === 'csv') {
    return stringifyCSV(parsed);
  }
  throw new Error(`extention accepts only 'srt', 'csv' \n invalid ext : ${ext}`);
}
