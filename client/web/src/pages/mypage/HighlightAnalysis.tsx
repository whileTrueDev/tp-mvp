import React from 'react';
import Grid from '@material-ui/core/Grid';
import HighlightAnalysisHero from '../../organisms/mypage/highlightAnalysis/HighlightAnalysisHero';
import HighlightAnalysisLayout from '../../organisms/mypage/layouts/HighlightAnalysisLayout';

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
        justify="flex-end"
        spacing={3}
      >
        <Grid
          item
          xs={9}
          style={{ margin: '5vw' }}
        >
          <HighlightAnalysisLayout />
        </Grid>
      </Grid>
    </Grid>
  );
}
