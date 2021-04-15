import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Container, Typography } from '@material-ui/core';
import { RANKING_PAGE_CONTAINER_WIDTH } from '../../../../assets/constants';

const useStyle = makeStyles((theme: Theme) => createStyles({
  headerImages: {
    width: '100%',
    backgroundColor: theme.palette.primary.main,
  },
  container: {
    minWidth: RANKING_PAGE_CONTAINER_WIDTH,
    maxWidth: RANKING_PAGE_CONTAINER_WIDTH,
    backgroundImage: 'url(/images/rankingPage/header_bg.svg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPositionY: 'bottom',
    height: theme.spacing(30),
    position: 'relative',
  },
  text: {
    position: 'absolute',
    fontSize: theme.typography.h3.fontSize,
    '&.top': {
      right: theme.spacing(20),
      bottom: theme.spacing(10),
    },
    '&.bottom': {
      right: theme.spacing(30),
      bottom: theme.spacing(5),
    },

  },
}));
export default function HeaderDecoration(): JSX.Element {
  const classes = useStyle();
  return (
    <div className={classes.headerImages}>
      <Container className={classes.container}>
        <Typography className={`${classes.text} top`}>
          싸우지 말고
          {' '}
          <strong>잘</strong>
          {' '}
          지내자!
        </Typography>
        <Typography className={`${classes.text} bottom`}>멍멍</Typography>
      </Container>
    </div>

  );
}
