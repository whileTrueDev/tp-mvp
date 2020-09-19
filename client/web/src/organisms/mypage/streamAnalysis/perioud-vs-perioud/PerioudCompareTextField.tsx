import React from 'react';
import { Grid, Typography, TextField } from '@material-ui/core';
import { PerioudCompareTextBoxProps } from './PerioudCompareHero.interface';



export default function PerioudCompareTextField(props: PerioudCompareTextBoxProps): JSX.Element {
  const { base, perioud} = props;
  return (
    <Grid container direction="row" spacing={2}>
      <Grid item>
        <TextField
         variant="outlined" 
         style={{width: '178px',height: '35px', borderColor: base? 'red':'blue',textAlign: 'center' }}
         placeholder="YYYY-MM-DD"
         type="date"
         />
      </Grid>
      <Grid item alignItems="center" style={{height: '100%'}}>
        <Typography variant="h4">
          ~
        </Typography>
      </Grid>
      <Grid item>
      <TextField
         variant="outlined" 
         style={{width: '178px',height: '35px', borderColor: base? 'red':'blue', }}
         placeholder="YYYY-MM-DD"
         />
      </Grid>
    </Grid>
  );
}
