import React from 'react';
import Grid from '@material-ui/core/Grid';
import HighlightAnalysisHero from '../../../organisms/mypage/highlightAnalysis/HighlightAnalysisHero';
import HighlightAnalysisLayout from '../../../organisms/mypage/layouts/HighlightAnalysisLayout';

export default function HighlightAnalysis(): JSX.Element {
  return (
    <Grid
      container
      justify="center"
      alignItems="center"
    >
      <Grid
        container
        justify="center"
        alignItems="center"
        direction="column"
      >
        <Grid item>
          <HighlightAnalysisHero />
        </Grid>
      </Grid>
      <Grid
        container
        justify="center"
        spacing={1}
      >
        <Grid
          item
          style={{ width: '100%' }}
        >
          <HighlightAnalysisLayout />
        </Grid>
      </Grid>
    </Grid>
  );
}
