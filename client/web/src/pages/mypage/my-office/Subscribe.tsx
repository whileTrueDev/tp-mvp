import { Typography } from '@material-ui/core';
import React from 'react';
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
import useScrollTop from '../../../utils/hooks/useScrollTop';

export default function Subscribe(): JSX.Element {
  // 처음 페이지 렌더링시 화면 최상단으로 스크롤이동
  useScrollTop();
  return (
    <MypageSectionWrapper style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    }}
    >
      <Typography variant="h6">
        CBT 에서는 사용되지 않는 기능입니다.
      </Typography>
      <Typography variant="h6">
        트루포인트를 이용해주셔서 감사합니다. 크리에이터님의 무궁한 영광을 기원합니다.
      </Typography>
    </MypageSectionWrapper>
  );
}
