import React from 'react';
import { Tooltip } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import HelpIcon from '@material-ui/icons/Help';
import SectionTitle from '../shared/sub/SectionTitles';

const useStyles = makeStyles(() => createStyles({
  sectionTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1em',
    '&>*': {
      marginRight: '1rem',
    },
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
        <HelpIcon color="primary" />
      </Tooltip>
      )}

    </div>
  );
}
