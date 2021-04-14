import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles((theme: Theme) => createStyles({
  bg: {
    display: 'flex',
    alignItems: 'flex-end',
    width: '100%',
    height: theme.spacing(45),
    backgroundColor: theme.palette.background.paper,
    backgroundImage: 'url(/images/board/board_bg.png)',
    backgroundRepeat: 'repeat-x',
  },
  tv: {
    width: '50%',
    height: '80%',
  },
  afreeca: {
    backgroundImage: 'url(/images/board/tv_afreeca.png)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50% 0%',
  },
  twitch: {
    backgroundImage: 'url(/images/board/tv_twitch.png)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50% 0%',
  },
}));

export default function BoardHeaderImage(): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.bg}>
      <div className={classnames(classes.tv, classes.afreeca)} />
      <div className={classnames(classes.tv, classes.twitch)} />
    </div>
  );
}
