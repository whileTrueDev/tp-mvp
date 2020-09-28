import React from 'react';
// material-ui core component;
import { Grid } from '@material-ui/core';
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
// organisms
import PerioudCompareHero from '../../../organisms/mypage/streamAnalysis/perioud-vs-perioud/PerioudCompareHero';

export default function PeriodVsPeriodAnalysis(userId?: string): JSX.Element {
  return (
    <MypageSectionWrapper>
      <Grid container direction="column" spacing={2} style={{ height: 'auto' }}>
        <PerioudCompareHero
          userId={userId || ''}
        />
      </Grid>
    </MypageSectionWrapper>
  );
}
