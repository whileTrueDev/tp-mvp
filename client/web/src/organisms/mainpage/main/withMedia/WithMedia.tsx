import { Container } from '@material-ui/core';
import React from 'react';
import styles from '../style/WithMedia.style';
import source from '../source/textsource';



export default function WithMedia(): JSX.Element {

  const classes = styles();

  return (
    <div className={classes.root}>
      <Container className={classes.wraper}>
        <div className={classes.mainTopLine} />
        <div className={classes.mainTitle}>
          {source.withMedia.title}
        </div>
        <div className={classes.mainContent}>
          {source.withMedia.content}
        </div>
        <div className={classes.logoWraper}>
          <img src="./images/logo/youtubeLogo.png" alt="youtube-logo" className={classes.logo} />
          <img src="./images/logo/afreecatvLogo.png" alt="afreecatv-logo" className={classes.logo} />
          <img src="./images/logo/twitchLogo.png" alt="twitch-logo" className={classes.logo} />
        </div>
      </Container>
    </div>
  );
};