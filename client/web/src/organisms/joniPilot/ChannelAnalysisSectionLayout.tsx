import React from 'react';
import { Paper } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import ChannelAnalysisSectionTitle from './ChannelAnalysisSectionTitle';

const useStyles = makeStyles(() => createStyles({
  container: {
    marginBottom: '6px',
    padding: '4% 5%',
  },
}));

export interface ChannelAnalysisSectionLayoutProps{
  title: string;
  tooltip?: string;
  children?: JSX.Element[] | JSX.Element | null
}

export default function ChannelAnalysisSectionLayout(props: ChannelAnalysisSectionLayoutProps): JSX.Element {
  const { title, tooltip, children } = props;
  const classes = useStyles();
  return (
    <Paper className={classes.container}>
      <ChannelAnalysisSectionTitle
        mainTitle={title}
        tooltipContent={tooltip}
      />
      {children}
    </Paper>
  );
}
