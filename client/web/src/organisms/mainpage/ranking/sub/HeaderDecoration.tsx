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
    height: theme.spacing(30),
    position: 'relative',
    '& .bg-img': {
      position: 'absolute',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
    },
    '& .zigzag': {
      bottom: 0,
      left: 0,
      width: '26%',
      minHeight: '149px',
      backgroundImage: 'url(images/rankingPage/zigzag.svg)',
    },
    '& .dog': {
      right: 0,
      bottom: 0,
      width: '18%',
      minHeight: '219px',
      backgroundImage: 'url(images/rankingPage/dog.svg)',
    },
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
        <div className="bg-img zigzag" />
        <div className="bg-img dog" />

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
