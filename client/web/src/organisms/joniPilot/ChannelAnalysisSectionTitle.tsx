import React from 'react';
import { Tooltip } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';

import SectionTitle from '../shared/sub/SectionTitles';

const useStyles = makeStyles(() => createStyles({
  sectionTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1em',
  },
  questionMark: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '1em',
    height: '1em',
    borderRadius: '50%',
    backgroundColor: 'blue',
    color: 'white',
    marginLeft: '1em',
  },
}));

export interface ChannelAnalysisSectionTitleProps{
  mainTitle: string;
  tooltipContent?: string;
}

export default function ChannelAnalysisSectionTitle(props: ChannelAnalysisSectionTitleProps): JSX.Element {
  const classes = useStyles();
  const { mainTitle, tooltipContent } = props;
  return (
    <div className={classes.sectionTitleContainer}>
      <SectionTitle mainTitle={mainTitle} />
      {tooltipContent
      && (
      <Tooltip title={tooltipContent}>
        <span className={classes.questionMark}>?</span>
      </Tooltip>
      )}

    </div>
  );
}
