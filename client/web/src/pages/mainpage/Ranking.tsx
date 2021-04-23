import React, { useMemo } from 'react';
import { Container, Grid } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Carousel from 'react-material-ui-carousel';
import {
  Redirect, Route, Switch, useRouteMatch,
} from 'react-router-dom';
import Appbar from '../../organisms/shared/Appbar';
import Footer from '../../organisms/shared/footer/Footer';
import UserReactionCard from '../../organisms/mainpage/ranking/UserReactionCard';
import WeeklyViewerRankingCard from '../../organisms/mainpage/ranking/WeeklyViewerRankingCard';
import TopTenCard from '../../organisms/mainpage/ranking/ToptenCard';
import ViewerComparisonPolarAreaCard from '../../organisms/mainpage/ranking/ViewerComparisonPolarAreaCard';
import { useRankingPageLayout, useCarouselStyle } from '../../organisms/mainpage/ranking/style/RankingPage.style';
import CreatorEvaluation from '../../organisms/mainpage/ranking/CreatorEvaluation';
import RecentStreamList from '../../organisms/mainpage/ranking/RecentStreamList';
import RatingsList from '../../organisms/mainpage/ranking/RatingsList';
import HeaderDecoration from '../../organisms/mainpage/ranking/sub/HeaderDecoration';
import FooterDecoration from '../../organisms/mainpage/ranking/sub/FooterDecoration';
import StreamEvaluation from '../../organisms/mainpage/ranking/StreamEvaluation';

export default function Ranking(): JSX.Element {
  const wrapper = useRankingPageLayout();
  const carousel = useCarouselStyle();
  const { path } = useRouteMatch();
  const memoAppbar = useMemo(() => <Appbar />, []);
  const memoFooter = useMemo(() => <Footer />, []);
  const headerDecoration = useMemo(() => <HeaderDecoration />, []);
  const footerDecoration = useMemo(() => <FooterDecoration />, []);
  return (
    <div className={wrapper.background}>
      {memoAppbar}
      {headerDecoration}

      <Switch>
        <Route exact path={path}>
          <div className={wrapper.top}>
            <Container className={wrapper.container}>
              <Carousel
                NextIcon={<ArrowForwardIosIcon color="primary" className={carousel.buttonIcon} />}
                PrevIcon={<ArrowBackIosIcon color="primary" className={carousel.buttonIcon} />}
                indicators={false}
                animation="slide"
                autoPlay={false}
                navButtonsProps={{ style: { backgroundColor: 'transparent', transform: 'translateY(-2rem)' }, className: 'carousel-button' }}
              >
                <ViewerComparisonPolarAreaCard />
                <WeeklyViewerRankingCard />
              </Carousel>
            </Container>
          </div>
          <Container className={wrapper.container}>
            <Grid container spacing={2}>
              <Grid item xs={8} className={wrapper.left}>
                <TopTenCard />
              </Grid>
              <Grid item xs={4} className={wrapper.right}>
                <RatingsList />
                {/* <MonthlyScoresRankingCard /> */}
                <UserReactionCard />
              </Grid>
            </Grid>
          </Container>
          {footerDecoration}
        </Route>
        {/* 방송인 정보 페이지 */}
        <Route exact path={`${path}/:platform/:creatorId`}>
          {/* 최근 방송 정보 섹션 */}
          <RecentStreamList />

          <Container className={wrapper.container}>
            <CreatorEvaluation />
          </Container>
        </Route>
        {/* 최근 방송 정보 섹션 */}
        <Route exact path={`${path}/:platform/:creatorId/:streamId`}>
          <Container className={wrapper.container}>
            <StreamEvaluation />
          </Container>
        </Route>

        <Route>
          <Redirect to="/ranking" />
        </Route>
      </Switch>

      {memoFooter}
    </div>

  );
}
