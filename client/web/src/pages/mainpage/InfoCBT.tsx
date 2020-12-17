import React from 'react';
import {
  Container, Divider, makeStyles, Typography,
} from '@material-ui/core';
import Appbar from '../../organisms/shared/Appbar';
import source from '../others/source/InfoCBT';
import Footer from '../../organisms/shared/footer/Footer';
import CBTInquiry from '../../organisms/shared/sub/CBTInquiry';
import ProductHero from '../../organisms/mainpage/main/productHero/ProductHero';

const styles = makeStyles((theme) => ({
  topRoot: {
    backgroundColor: theme.palette.background.paper,
  },
  root: {
    padding: theme.spacing(10),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(5),
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
  period: {
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      fontSize: 22,
    },
  },
  wrapper: {
    margin: `${theme.spacing(6)}px 0px`,
  },
  titleWrapper: {
    marginBottom: theme.spacing(6),
    [theme.breakpoints.down('sm')]: {
      fontSize: 32,
    },
  },
  cbtImg: {
    maxWidth: '100%',
    height: 'auto',
  },
  content: {
    [theme.breakpoints.down('sm')]: {
      fontSize: 18,
    },
  },
  imgWrapper: {
    width: '100%',
  },
  videoWrapper: {
    position: 'relative',
    width: '100%',
    paddingTop: '56.6%',
    marginTop: theme.spacing(6),
  },
  cbtVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
}));

export default function InfoCBT(): JSX.Element {
  const classes = styles();

  return (
    <div className={classes.topRoot}>
      <Appbar />
      <ProductHero />
      <Container className={classes.root}>

        <div className={classes.videoWrapper}>
          <iframe
            src="https://www.youtube.com/embed/7y9TYQaTGy8"
            title="CbtInfoVideo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={classes.cbtVideo}
          />
        </div>

        <section className={classes.wrapper}>
          <Typography variant="h5" className={classes.period}>
            2020-12-21 ~ 클로즈베타 종료 시까지
          </Typography>
          <Typography variant="h3" className={classes.titleWrapper}>{source.firtstContent.title}</Typography>
          <Typography variant="h5" className={classes.period}>{source.firtstContent.content}</Typography>
          <Typography variant="h6">{source.firtstContent.sub}</Typography>
        </section>
        <Divider />
        <section className={classes.wrapper}>
          <Typography variant="h4" className={classes.titleWrapper} style={{ fontStyle: 'oblique' }}>{source.secondContent.title}</Typography>
          <Typography variant="h6" className={classes.content}>{source.secondContent.content}</Typography>
          <Typography variant="h6" className={classes.content}>{source.secondContent.sub}</Typography>
        </section>

        <section className={classes.wrapper}>
          <Typography variant="h4" className={classes.titleWrapper} style={{ fontStyle: 'oblique' }}>{source.thirdContent.title}</Typography>
          <Typography variant="h6" className={classes.content}>{source.thirdContent.content}</Typography>
          <Typography variant="h6" className={classes.content}>{source.thirdContent.sub}</Typography>
        </section>

        <div className={classes.imgWrapper}>
          <img src="/images/cbt/highlightImg.png" alt="편집점 분석" className={classes.cbtImg} />
        </div>

        <section className={classes.wrapper}>
          <Typography variant="h6" className={classes.content} style={{ marginBottom: 48 }}>{source.fourthContent.content}</Typography>
          <Typography variant="h6" className={classes.content} style={{ marginBottom: 48 }}>{source.fourthContent.sub1}</Typography>
          <Typography variant="h6" className={classes.content}>{source.fourthContent.sub2}</Typography>
        </section>
        <div className={classes.imgWrapper}>
          <img src="/images/cbt/streamAnalaysis.png" alt="방송 비교 분석" className={classes.cbtImg} />
        </div>
        <Typography variant="h6" className={classes.content} style={{ marginTop: 24 }}>{source.fourthContent.sub3}</Typography>

        <CBTInquiry />
      </Container>
      <Footer />
    </div>
  );
}
