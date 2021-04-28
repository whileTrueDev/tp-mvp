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
  tvContainer: {
    position: 'relative',
    width: '50%',
    height: '80%',
  },
  tv: {
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50% 0%',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  afreeca: {
    backgroundImage: 'url(/images/board/tv_afreeca.png)',
  },
  twitch: {
    backgroundImage: 'url(/images/board/tv_twitch.png)',
  },
  userLogo: {
    position: 'absolute', bottom: 16, left: 'calc(50% - 200px)', height: 230, width: 300,
  },
}));

export default function BoardHeaderImage(): JSX.Element {
  const classes = useStyles();
  const [{ data }] = useAxios<TodayTopViewerUsersRes>('broadcast-info/today-top-viewer');

  const twitchTopUser = useMemo(() => data?.find((x) => x.platform === 'twitch'), [data]);
  const afreecaTopUser = useMemo(() => data?.find((x) => x.platform === 'afreeca'), [data]);

  return (
    <div className={classes.bg}>
      <div className={classes.tvContainer}>
        <img src={afreecaTopUser?.afreecaLogo} alt="" className={classes.userLogo} />
        <div className={classnames(classes.tv, classes.afreeca)} />
      </div>
      <div className={classes.tvContainer}>
        <img src={twitchTopUser?.twitchLogo} alt="" className={classes.userLogo} />
        <div className={classnames(classes.tv, classes.twitch)} />
      </div>
    </div>
  );
}
