import React from 'react';
import {
  Container, makeStyles, Typography,
} from '@material-ui/core';
import shortid from 'shortid';
import Appbar from '../../organisms/shared/Appbar';
import source from '../others/source/InfoCBT';
import Footer from '../../organisms/shared/footer/Footer';
import CBTInquiry from '../../organisms/shared/sub/CBTInquiry';
import ProductHero from '../../organisms/mainpage/main/productHero/ProductHero';
import useScrollTop from '../../utils/hooks/useScrollTop';

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
    width: '100%',
    margin: `${theme.spacing(6)}px 0px`,
  },
  titleWrapper: {
    marginBottom: theme.spacing(6),
    [theme.breakpoints.down('sm')]: {
      fontSize: 32,
    },
    fontStyle: 'oblique',
  },
  cbtImg: {
    maxWidth: '100%',
    height: 'auto',
  },
  content: {
    marginBottom: theme.spacing(2),
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
  sub: {
    paddingTop: theme.spacing(4),
  },
}));

export default function InfoCBT(): JSX.Element {
  const classes = styles();

  // pathname 변경시 화면 위로 보내는 훅
  useScrollTop();
  return (
    <div className={classes.topRoot}>
      <Appbar />
      <ProductHero pageIn="cbtInfo" />
      <Container className={classes.root}>

        <div className={classes.videoWrapper}>
          <iframe
            src="https://www.youtube.com/embed/ANBakGw49hI"
            title="CbtInfoVideo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={classes.cbtVideo}
          />
        </div>

        <section className={classes.wrapper}>
          <Typography variant="h4" className={classes.titleWrapper}>{source.firtstContent.title}</Typography>
          {source.firtstContent.content.split('\n').map((content) => (
            <Typography variant="h5" className={classes.content} key={shortid.generate()}>{content}</Typography>
          ))}
          <Typography variant="h6" className={classes.sub}>{source.firtstContent.sub}</Typography>
        </section>

        <section className={classes.wrapper}>
          <Typography variant="h4" className={classes.titleWrapper}>{source.secondContent.title}</Typography>
          {source.secondContent.content.split('\n').map((content) => (
            <Typography variant="h5" className={classes.content} key={shortid.generate()}>{content}</Typography>
          ))}
          <Typography variant="h6" className={classes.sub}>{source.secondContent.sub}</Typography>
        </section>

        <div className={classes.imgWrapper}>
          <img src="/images/cbt/exportHighlight.png" alt="편집점 내보내기" className={classes.cbtImg} />
        </div>
        {/* 아래 편집점 알아보기 이미지 변경 필요 */}
        <div className={classes.imgWrapper}>
          <img src="/images/cbt/highlight.png" alt="편집점 분석" className={classes.cbtImg} />
        </div>

        <section className={classes.wrapper}>
          <Typography variant="h5" className={classes.content}>{source.thirdContent.content}</Typography>
          <Typography variant="h5" className={classes.sub}>{source.thirdContent.sub}</Typography>
        </section>

        <div className={classes.imgWrapper}>
          <img src="/images/cbt/streamAnalaysis.png" alt="방송 비교 분석" className={classes.cbtImg} />
        </div>

        <section className={classes.wrapper}>
          <Typography variant="h5" className={classes.content}>{source.fourthContent.content}</Typography>
          <Typography variant="h5" className={classes.content}>{source.fourthContent.sub1}</Typography>
          <div className={classes.imgWrapper}>
            <img src="/images/cbt/periodAnalaysis.png" alt="기간 추세 분석" className={classes.cbtImg} />
          </div>
          <Typography variant="h5" className={classes.sub}>{source.fourthContent.sub2}</Typography>
        </section>
        <CBTInquiry />

        <section className={classes.wrapper}>
          <Typography variant="h4" className={classes.titleWrapper}>{source.fifthContent.title}</Typography>
          <Typography variant="h5" className={classes.content}>{source.fifthContent.content}</Typography>
          <Typography variant="h6" className={classes.sub}>{source.fifthContent.sub}</Typography>
        </section>
      </Container>
      <Footer />
    </div>
  );
}
