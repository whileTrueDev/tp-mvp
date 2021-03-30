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
export default function BoardTitle({ platform, boardType }: {platform: 'afreeca'|'twitch', boardType?: boolean}): JSX.Element {
  const classes = useStyles();
  if (!platform) {
    return (
      <Typography variant="h4" className={classes.titleText}>게시판</Typography>
    );
  }
  return (
    <div className={classes.title}>
      <img
        className={classes.platformLogo}
        src={`/images/logo/${platform}Logo.png`}
        alt={`${platform}Logo`}
      />
      <Typography variant="h4" className={classes.titleText}>
        {`${platform === 'afreeca' ? '아프리카' : '트위치'}
          ${boardType ? '방송인' : '게시판'}`}
      </Typography>
    </div>
  );
}
