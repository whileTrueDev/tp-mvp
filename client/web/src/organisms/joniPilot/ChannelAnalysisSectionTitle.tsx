import React from 'react';
import { Popover, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import HelpIcon from '@material-ui/icons/Help';
import SectionTitle from '../shared/sub/SectionTitles';
import useAnchorEl from '../../utils/hooks/useAnchorEl';

const useStyles = makeStyles((theme: Theme) => createStyles({
  sectionTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    '&>*': {
      marginRight: theme.spacing(2),
    },
  },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(2),
    maxWidth: theme.spacing(50),
  },
}));

export interface ChannelAnalysisSectionTitleProps{
  mainTitle: string;
  description? : string;
}

export default function ChannelAnalysisSectionTitle(props: ChannelAnalysisSectionTitleProps): JSX.Element {
  const classes = useStyles();
  const { mainTitle, description } = props;
  const {
    open, anchorEl, handleAnchorOpen, handleAnchorClose,
  } = useAnchorEl();
  return (
    <div className={classes.sectionTitleContainer}>
      <SectionTitle mainTitle={mainTitle} />
      {description
      && (
        <>
          <Typography
            onMouseEnter={handleAnchorOpen}
            onMouseLeave={handleAnchorClose}
          >
            <HelpIcon color="primary" />
          </Typography>

          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleAnchorClose}
            className={classes.popover}
            classes={{
              paper: classes.paper,
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            disableRestoreFocus
          >
            {description}
          </Popover>
        </>
      )}

    </div>
  );
}
