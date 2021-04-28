import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { RANKING_PAGE_CONTAINER_WIDTH } from '../../../../assets/constants';

const useStyle = makeStyles((theme: Theme) => createStyles({
  headerImages: {
    width: '100%',
    backgroundColor: theme.palette.primary.main,
    overflowX: 'hidden',
  },
  container: {
    minWidth: RANKING_PAGE_CONTAINER_WIDTH,
    maxWidth: RANKING_PAGE_CONTAINER_WIDTH,
    backgroundImage: 'url(/images/rankingPage/header_bg.png)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPositionY: 'bottom',
    height: theme.spacing(30),
    position: 'relative',
    marginLeft: 'auto',
    marginRight: -12,
  },
}));
export default function HeaderDecoration(): JSX.Element {
  const classes = useStyle();
  return (
    <div className={classes.headerImages}>
      <div className={classes.container} />
    </div>

  );
}
