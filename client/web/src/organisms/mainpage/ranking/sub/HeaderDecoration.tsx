import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import { MAX_WIDTH_DESKTOP } from '../../../../assets/constants';

const useStyle = makeStyles((theme: Theme) => createStyles({
  headerImages: {
    width: '100%',
    backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.background.default,
    overflowX: 'hidden',
  },
  container: {
    paddingTop: theme.spacing(4),
    maxWidth: MAX_WIDTH_DESKTOP,
  },
}));
export default function HeaderDecoration(): JSX.Element {
  const classes = useStyle();
  return (
    <div className={classes.headerImages}>
      <Container className={classes.container}>
        <img src="/images/rankingPage/cat_tv_background.png" alt="고양이" />
      </Container>
    </div>

  );
}
