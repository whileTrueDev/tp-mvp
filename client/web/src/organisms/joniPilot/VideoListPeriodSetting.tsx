import React from 'react';
import { Typography } from '@material-ui/core';
import PeriodStreamList from '../mypage/stream-analysis/shared/PeriodStreamsList';
import RangeSelectCalendar from '../mypage/stream-analysis/shared/RangeSelectCalendar';

const handleDiaglogClose = (): void => {
  // console.log('handleDialogClose');
};
const handlePeriod = (): void => {
  // console.log('handlePeriod');
};
const handleStreamList = (): void => {
  // console.log('handleStreamList');
};

// 다른 페이지에 있는 달력, 방송목록 컴포넌트 좀 더 살펴보고 만들기
export default function ChannelAnalysisPeriodSetting(): JSX.Element {
  return (
    <div>
      <Typography>동영상 분석을 위한 기간 설정</Typography>
      <Typography>선택된 방송</Typography>
      <RangeSelectCalendar
        period={[new Date(), new Date()]}
        handleDialogClose={handleDiaglogClose}
        handlePeriod={handlePeriod}
      />
      <PeriodStreamList
        selectedStreams={[]}
        handleStreamList={handleStreamList}
      />
    </div>
  );
}
