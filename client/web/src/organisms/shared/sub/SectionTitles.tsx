import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Typography, Grid } from '@material-ui/core';

const styles = makeStyles((theme) => ({
  hr: {
    margin: `${theme.spacing(1)}px 0px`,
    backgroundColor: theme.palette.primary.main,
    height: theme.spacing(0.5),
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    margin: `${theme.spacing(1)}px 0px`,
  },
}));

interface SectionTitleProps {
  mainTitle: string;
}

export default function SectionTitle({ mainTitle }: SectionTitleProps): JSX.Element {
  const classes = styles();

  return (
    <div>
      <Grid item xs={2}>
        <Divider variant="middle" className={classes.hr} />
      </Grid>
      <Typography variant="h4" className={classes.title}>
        {mainTitle}
      </Typography>
    </div>
  );
}
