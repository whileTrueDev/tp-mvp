import React, { useMemo } from 'react';
import { Container, Grid } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Carousel from 'react-material-ui-carousel';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Appbar from '../../organisms/shared/Appbar';
import Footer from '../../organisms/shared/footer/Footer';
import UserReactionCard from '../../organisms/mainpage/ranking/UserReactionCard';
import WeeklyViewerRankingCard from '../../organisms/mainpage/ranking/WeeklyViewerRankingCard';
import MonthlyScoresRankingCard from '../../organisms/mainpage/ranking/MonthlyScoresRankingCard';
import TopTenCard from '../../organisms/mainpage/ranking/ToptenCard';
import ViewerComparisonPolarAreaCard from '../../organisms/mainpage/ranking/ViewerComparisonPolarAreaCard';
import { useRankingPageLayout, useCarouselStyle } from '../../organisms/mainpage/ranking/style/RankingPage.style';
import CreatorEvaluation from '../../organisms/mainpage/ranking/CreatorEvaluation';

export default function Ranking(): JSX.Element {
  const wrapper = useRankingPageLayout();
  const carousel = useCarouselStyle();
  const { path } = useRouteMatch();
  const memoAppbar = useMemo(() => <Appbar />, []);
  const memoFooter = useMemo(() => <Footer />, []);

  return (
    <div>
      {memoAppbar}
      <div className={wrapper.background}>
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

          <Switch>
            <Route exact path={path}>
              <Grid container spacing={2}>
                <Grid item xs={8} className={wrapper.left}>
                  <TopTenCard />
                </Grid>
                <Grid item xs={4} className={wrapper.right}>
                  <MonthlyScoresRankingCard />
                  <UserReactionCard />
                </Grid>
              </Grid>
            </Route>
            <Route path={`${path}/:creatorId`}>
              <CreatorEvaluation />
            </Route>
          </Switch>

        </Container>
      </div>
      {memoFooter}
    </div>

  );
}
