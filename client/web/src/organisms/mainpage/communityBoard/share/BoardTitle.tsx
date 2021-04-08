import React from 'react';
import {
  makeStyles, createStyles, Theme,
} from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => createStyles({
  title: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    '&>*': {
      marginRight: theme.spacing(1),
    },
    padding: theme.spacing(2, 0),
  },
  platformLogo: {
    width: '100%',
    maxWidth: '50px',
    minHeight: '100%',
  },
  titleText: {

  },
}));

const platformNames = {
  afreeca: '아프리카',
  twitch: '트위치',
  free: '자유',
};
export interface BoardTitleProps {
  platform: 'afreeca'|'twitch'|'free';
  boardType?: boolean;
}
export default function BoardTitle({ platform, boardType }: BoardTitleProps): JSX.Element {
  const classes = useStyles();
  if (!platform) {
    return (
      <Typography variant="h4" className={classes.titleText}>게시판</Typography>
    );
  }
  return (
    <div className={classes.title}>
      { (platform !== 'free')
        ? (
          <img
            className={classes.platformLogo}
            src={`/images/logo/${platform}Logo.png`}
            alt={`${platform}Logo`}
          />
        )
        : null}

      <Typography variant="h4" className={classes.titleText}>
        {`${platformNames[platform]}
          ${boardType ? '방송인' : '게시판'}`}
      </Typography>
    </div>
  );
}
