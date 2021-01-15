import React, { memo } from 'react';
import { Paper } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ChannelAnalysisSectionTitle from './ChannelAnalysisSectionTitle';

const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    marginBottom: theme.spacing(1),
    padding: '4% 5%',
  },
}));

export interface ChannelAnalysisSectionLayoutProps{
  title: string;
  tooltip?: string;
  description?: string;
  children?: JSX.Element[] | JSX.Element | null
}

export default memo((props: ChannelAnalysisSectionLayoutProps): JSX.Element => {
  const {
    title, children, description,
  } = props;
  const classes = useStyles();
  return (
    <Paper className={classes.container}>
      <ChannelAnalysisSectionTitle
        mainTitle={title}
        description={description}
      />
      {children}
    </Paper>
  );
});
