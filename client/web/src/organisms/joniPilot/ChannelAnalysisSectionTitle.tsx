import React from 'react';
import { Tooltip, Popover, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import HelpIcon from '@material-ui/icons/Help';
import SectionTitle from '../shared/sub/SectionTitles';
import useAnchorEl from '../../utils/hooks/useAnchorEl';

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
  const {
    open, anchorEl, handleAnchorOpen, handleAnchorClose,
  } = useAnchorEl();
  return (
    <div className={classes.sectionTitleContainer}>
      <SectionTitle mainTitle={mainTitle} />
      {tooltipContent
      && (
        <>
          <Typography
            onMouseEnter={handleAnchorOpen}
            onMouseLeave={handleAnchorClose}
          >
            <HelpIcon color="primary" />
          </Typography>
          <Popover open={open} anchorEl={anchorEl}>
            <Typography>{tooltipContent}</Typography>
          </Popover>

          <Tooltip title={tooltipContent}>
            <HelpIcon color="secondary" />
          </Tooltip>

        </>
      )}

    </div>
  );
}
