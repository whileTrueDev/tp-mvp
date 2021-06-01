import React, { useLayoutEffect, useState } from 'react';
import { Container, Grid, Typography } from '@material-ui/core';
import shortid from 'shortid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import styles from '../style/Intro.style';
import source from '../source/textsource';
import { MAX_WIDTH_DESKTOP } from '../../../../assets/constants';

export default function ProductHero(): JSX.Element {
  const classes = styles();
  const theme = useTheme();
  const [iframeLoading, setIframeLoading] = useState(false);
  const isSMSizeDisplay = useMediaQuery(theme.breakpoints.down('sm'));

  useLayoutEffect(() => {
    const iframeDocument = document.getElementById('introVideo') as HTMLIFrameElement;

    function handleLoad() {
      if (!iframeLoading) {
        setIframeLoading(true);
      }
    }
    iframeDocument.addEventListener('load', handleLoad);

    return () => {
      iframeDocument.removeEventListener('load', handleLoad);
    };
  }, [iframeLoading]);

  return (
    <div className={classes.root}>
      <Container style={{ maxWidth: MAX_WIDTH_DESKTOP }}>
        <Grid
          container
          direction="row"
          justify={isSMSizeDisplay ? 'center' : 'space-between'}
          alignItems="center"
        >
          <Grid item md={4} sm={5} xs={12} className={classes.wraper}>
            <div className={classes.titleWrap}>
              { source.intro.title.split('\n').map((row) => (
                <Typography
                  variant="h5"
                  key={shortid.generate()}
                  className={classes.mainTitle}
                >
                  {row}
                </Typography>
              ))}
            </div>
            <div>
              {(isSMSizeDisplay ? source.intro.content.downSM : source.intro.content.overSM).split('\n').map((row) => (
                <Typography
                  variant="h5"
                  key={shortid.generate()}
                  className={classes.mainContent}
                >
                  {row}
                </Typography>
              ))}
            </div>
          </Grid>
          <Grid item md={7} sm={6} xs={12}>
            <div className={classes.introVideoWrap}>
              <iframe
                src="https://www.youtube.com/embed/ANBakGw49hI"
                title="IntroVideo"
                frameBorder="0"
                id="introVideo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={!iframeLoading ? classes.introVideo : classes.introVideoReady}
              />
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
