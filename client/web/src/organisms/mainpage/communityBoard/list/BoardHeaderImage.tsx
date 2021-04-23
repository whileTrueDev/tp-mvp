import { TodayTopViewerUsersRes } from '@truepoint/shared/dist/res/TodayTopViewerUsersRes.interface';
import React, { useMemo } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import classnames from 'classnames';
import useAxios from 'axios-hooks';

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
  const [{ data }] = useAxios<TodayTopViewerUsersRes>('broadcast-info/today-top-viewer');

  const twitchTopUser = useMemo(() => data?.find((x) => x.platform === 'twitch'), [data]);
  console.log(twitchTopUser);
  const afreecaTopUser = useMemo(() => data?.find((x) => x.platform === 'afreeca'), [data]);
  console.log(afreecaTopUser);

  return (
    <div className={classes.bg}>
      <div className={classnames(classes.tv, classes.afreeca)} />
      <div className={classnames(classes.tv, classes.twitch)} />
    </div>
  );
}
