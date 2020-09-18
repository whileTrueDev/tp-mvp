import React from 'react';
import { Grid, Typography, TextField } from '@material-ui/core';

export default function PerioudCompareTextField(): JSX.Element {
  return (
    <Grid container direction="row">
      <Grid item>
        <TextField />
      </Grid>
      <Grid item>
        <Typography>
          ~
        </Typography>
      </Grid>
      <Grid item>
        <TextField />
      </Grid>
    </Grid>
  );
}
