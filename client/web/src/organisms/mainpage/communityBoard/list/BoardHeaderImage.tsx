import React, { useMemo } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import classnames from 'classnames';
import { BOARD_PAGE_MAX_WIDTH } from '../../../../assets/constants';
import { useTodayTopViewer } from '../../../../utils/hooks/query/useTodayTopViewer';

const useStyles = makeStyles((theme: Theme) => createStyles({
  bg: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: theme.spacing(25),
    [theme.breakpoints.down('sm')]: {
      height: theme.spacing(13),
    },
    backgroundColor: theme.palette.background.paper,
    backgroundImage: 'url(/images/board/board_bg.png)',
    backgroundRepeat: 'repeat-x',
  },
  container: {
    width: '100%',
    maxWidth: BOARD_PAGE_MAX_WIDTH,
    display: 'flex',
    justifyContent: 'space-between',
  },
  tvContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  tv: {
    width: '100%',
    height: '100%',
    maxWidth: 276,
    maxHeight: 191,
    [theme.breakpoints.down('sm')]: {
      maxWidth: 162,
      maxHeight: 108,
    },
    padding: '5%',
    position: 'relative',
    '&:after': {
      content: '" "',
      position: 'absolute',
      left: 0,
      top: 0,
      width: '110%',
      height: '100%',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    },
  },
  afreeca: {
    '&:after': {
      backgroundImage: 'url(/images/board/tv_afreeca.png)',
    },
  },
  twitch: {
    '&:after': {
      backgroundImage: 'url(/images/board/tv_twitch.png)',
    },
  },
  userLogo: {
    width: '100%',
    objectFit: 'fill',
    height: '100%',
  },
}));

export default function BoardHeaderImage(): JSX.Element {
  const classes = useStyles();
  const { data } = useTodayTopViewer();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const twitchTopUser = useMemo(() => data?.find((x) => x.platform === 'twitch'), [data]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const afreecaTopUser = useMemo(() => data?.find((x) => x.platform === 'afreeca'), [data]);

  return (
    <div className={classes.bg}>
      <div className={classes.container}>
        <div className={classes.tvContainer}>
          <div className={classnames(classes.tv, classes.afreeca)}>
            <img src={afreecaTopUser ? afreecaTopUser.afreecaLogo : undefined} alt="" className={classes.userLogo} />
          </div>

        </div>
        <div className={classes.tvContainer}>
          <div className={classnames(classes.tv, classes.twitch)}>
            <img src={twitchTopUser ? twitchTopUser.twitchLogo : undefined} alt="" className={classes.userLogo} />
          </div>
        </div>
      </div>

    </div>
  );
}
