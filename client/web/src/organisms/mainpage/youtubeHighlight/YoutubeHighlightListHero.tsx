import classnames from 'classnames';
import { Typography, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import useHeroStyles from '../shared/ProductHero.style';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.primary.main,
  },
  wrapper: {
    alignItems: 'flex-start',
  },
  text: {
    color: theme.palette.common.white,
  },
  title: {
    fontWeight: theme.typography.fontWeightBold,
  },
}));

export default function YoutubeHighlightListHero(): React.ReactElement {
  const myOwnClasses = useStyles();
  const classes = useHeroStyles();
  return (
    <div className={classnames(classes.root, myOwnClasses.container)}>
      <Container className={classnames(classes.wraper, myOwnClasses.wrapper)}>
        <img src="/images/youtube-list/zebobaram.png" alt="" />
        <Typography variant="h4" className={classnames(myOwnClasses.text, myOwnClasses.title)}>
          유튜브 편집점 제공
        </Typography>
        <Typography className={myOwnClasses.text}>
          시청자들이 재밌게 보았던 시간을 찾아드립니다!
        </Typography>
        <Typography className={myOwnClasses.text}>
          유튜브 편집시 놓치지 말고 활용해보세요!
        </Typography>
      </Container>
    </div>
  );
}
