import React from 'react';
import {
  Route, useRouteMatch, Switch,
} from 'react-router-dom';
import { makeStyles, createStyles } from '@material-ui/styles';

import MypageSectionWrapper from '../../atoms/MypageSectionWrapper';
import MypageHero from '../../organisms/shared/sub/MypageHero';
import VideoList from '../../organisms/joniPilot/VideoList';
import VideoAnalysis from '../../organisms/joniPilot/VideoAnalysis';

const textSource = {
  channelAnalysisHeroSection: {
    eachCardContent: [
      {
        cardHeader: '분석 대시보드',
        cardTitle: '채널 분석 분석차트',
        cardIcon: '/images/analyticsPage/balloon.png',
        cardText: `
        가실 줄이 있으랴. 관용은 미덕이다가서 발병난다.  
주었을 때 이 몸이 죽고 죽어 일백번 고쳐 죽어 백골이`,
      },
      {
        cardHeader: '분석 대시보드',
        cardTitle: '유입 분석 분석차트',
        cardIcon: '/images/analyticsPage/balloon.png',
        cardText: `
        가실 줄이 있으랴. 관용은 미덕이다가서 발병난다.  
주었을 때 이 몸이 죽고 죽어 일백번 고쳐 죽어 백골이`,
      },
      {
        cardHeader: '분석 대시보드',
        cardTitle: '동영상 분석 분석차트',
        cardIcon: '/images/analyticsPage/balloon.png',
        cardText: `
        가실 줄이 있으랴. 관용은 미덕이다가서 발병난다.  
주었을 때 이 몸이 죽고 죽어 일백번 고쳐 죽어 백골이`,
      },
    ],
  },
};

const useStyles = makeStyles(() => createStyles({
  mypageHeroWrapper: {
    backgroundColor: 'rgba(63, 73, 145,50%)',
    padding: '20px 10%',
  },
  contentWrapper: {
    paddingTop: '0px',
  },
}));

export default function ChannelAnalysis(): JSX.Element {
  const { path } = useRouteMatch();
  const classes = useStyles();
  return (
    <div>
      <MypageSectionWrapper className={classes.mypageHeroWrapper}>
        <MypageHero textSource={textSource.channelAnalysisHeroSection} />
      </MypageSectionWrapper>

      <MypageSectionWrapper className={classes.contentWrapper}>
        <Switch>
          <Route exact path={`${path}`} component={VideoList} />
          <Route exact path={`${path}/videos/:id`} component={VideoAnalysis} />
        </Switch>
      </MypageSectionWrapper>
    </div>
  );
}
