import React from 'react';
// material-ui core component;
import { Grid } from '@material-ui/core';
// atom
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
// organisms
import StreamsAnalysisHero from '../../../organisms/mypage/streamAnalysis/stream-vs-stream/StreamsAnalysisHero';
import StreamsAnalysisBodyTest from '../../../organisms/mypage/streamAnalysis/stream-vs-stream/StreamsAnalysisBodyTest';

export default function StreamAnalysis(): JSX.Element {
  return (
    <MypageSectionWrapper>
      <Grid container direction="column" spacing={2} style={{ height: 'auto' }}>

        <StreamsAnalysisHero />

        <StreamsAnalysisBodyTest />

      </Grid>
    </MypageSectionWrapper>
  );
}
