import React from 'react';
// material-ui core component;
import { Grid } from '@material-ui/core';
// atom
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
// organisms
import StreamCompareHero from '../../../organisms/mypage/streamAnalysis/stream-vs-stream/StreamCompareHero';
import StreamCompareBody from '../../../organisms/mypage/streamAnalysis/stream-vs-stream/StreamCompareBody';

export default function StreamAnalysis(userId: string): JSX.Element {
  return (
    <MypageSectionWrapper>
      <Grid container direction="column" spacing={2} style={{ height: 'auto' }}>
        <StreamCompareHero
          userId={userId}
        />
        <StreamCompareBody />
      </Grid>
    </MypageSectionWrapper>
  );
}
