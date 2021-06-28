// 일간 또는 시간간 데이터 그룹화
import { SearchEachS3StreamData } from '@truepoint/shared/dist/dto/stream-analysis/searchS3StreamData.dto';
import { PeriodAnalysisResType } from '@truepoint/shared/dist/res/PeriodAnalysisResType.interface';

// 8개 이상인 경우, 일간 데이터로 변환한다.
const DATE_FORMATTING_COUNT = 8;

const getFormattingDate = (dateString: string): string => {
  const newDate = new Date(dateString);
  newDate.setDate(newDate.getDate() + 1);
  // 달, 날짜에 대한 1단위 처리
  const result: string = [
    newDate.getFullYear(),
    newDate.getMonth() < 9 ? `0${newDate.getMonth() + 1}` : newDate.getMonth() + 1,
    newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate(),
  ].join('-');
  return result;
};

// 2시간 단위로 그룹화 또는 1일 단위로 그룹화
const getGroup = (groupDate: string, dateCount: number): string => {
  const splitedGroupDate = groupDate.split(' ');
  let dateString: string = splitedGroupDate[0];
  let timeNumber: number = parseInt(splitedGroupDate[1], 10);
  // 선택된 데이터의 날짜 갯수가 10이상일 때,
  if (dateCount > DATE_FORMATTING_COUNT) {
    return dateString;
  }

  // 홀수면 +1 
  if (timeNumber % 2 === 1) {
    timeNumber += 1;
  }

  // 00시인 경우, date 1일 증가, 0시로 변경 필요.
  if (timeNumber === 24) {
    dateString = getFormattingDate(dateString);
    timeNumber = 0;
  }

  return `${dateString} ${timeNumber}`;
};

export const getDateCount = (s3Request: SearchEachS3StreamData[]): number => {
  const dateSet = new Set();
  s3Request.forEach((element) => {
    const dateString = element.startedAt.split('T')[0];
    dateSet.add(dateString);
  });
  return dateSet.size;
};

export const groupingData = (periodAnalysisResType: PeriodAnalysisResType, dateCount: number): PeriodAnalysisResType => {
  // 기존 데이터에 대해 날짜 체크 
  const groupedData = [];
  let count = 0;
  let nowGroup = null;
  let groupValue = null;

  // 초기화하는 함수
  const setup = () => {
    groupValue = null;
    nowGroup = null;
    count = 0;
  };

  // 저장하는 함수
  const save = (groupDate: string): void => {
    // 현재 그룹이 존재하고, 동일 그룹이 아니라면 지금까지 저장된 것 저장.
    if (nowGroup && nowGroup !== groupDate) {
      const element = {
        ...groupValue,
        date: nowGroup,
        viewer_count: Math.round(groupValue.viewer_count / count),
      };
      // 평균 계산 후, 0인 지점에 대한 예외처리
      if (element.viewer_count !== 0) {
        groupedData.push(element);
      }
      setup();
    }
    // 그룹이 존재하지 않으면 저장하지 않음.
  };

  // 더하는 함수
  const add = (timeData, groupDate) => {
    // groupValue가 존재하지 않을 때(동일 그룹이 존재하지 않을 때), 초기화
    if (!groupValue) {
      groupValue = timeData;
      nowGroup = groupDate;
      count += 1;
    } else {
      // 동일할 때, 
      Object.keys(groupValue).forEach((key) => {
        groupValue[key] += timeData[key];
      });
      count += 1;
    }
  };

  periodAnalysisResType.value.forEach((timeData) => {
    // string형식의 데이터이므로 date로 변환후 시간을 뺴온다. ex) '2021-04-06 3'
    let groupDate = timeData.date.split(':')[0];
    // 2일간의 그룹핑을 위해 재변환한다.
    groupDate = getGroup(groupDate, dateCount);
    save(groupDate);
    add(timeData, groupDate);
    // 현재의 value에 더하기
  });
  save(nowGroup);

  return {
    ...periodAnalysisResType,
    value: groupedData,
  };
};
