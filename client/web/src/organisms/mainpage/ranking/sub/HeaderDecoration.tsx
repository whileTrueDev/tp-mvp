import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';

const useStyle = makeStyles((theme: Theme) => createStyles({
  headerImages: {
    width: '100%',
    backgroundColor: theme.palette.primary.main,
    overflowX: 'hidden',
  },
  container: {
    backgroundImage: 'url(/images/rankingPage/header_bg.png)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPositionY: 'bottom',
    height: theme.spacing(21),
  },
}));
export default function HeaderDecoration(): JSX.Element {
  const classes = useStyle();
  return (
    <div className={classes.headerImages}>
      <Container>
        <div className={classes.container} />
      </Container>
    </div>

  );
}
