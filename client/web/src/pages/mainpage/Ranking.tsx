import React, { useMemo } from 'react';
import { Container, Grid } from '@material-ui/core';
import Appbar from '../../organisms/shared/Appbar';
import Footer from '../../organisms/shared/footer/Footer';
import ProductHero from '../../organisms/mainpage/shared/ProductHero';
import UserReactionCard from '../../organisms/mainpage/ranking/UserReactionCard';
import WeeklyViewerRankingCard from '../../organisms/mainpage/ranking/WeeklyViewerRankingCard';
import MonthlyScoresRankingCard from '../../organisms/mainpage/ranking/MonthlyScoresRankingCard';
import TopTenCard from '../../organisms/mainpage/ranking/ToptenCard';
import ViewerComparisonPolarAreaCard from '../../organisms/mainpage/ranking/ViewerComparisonPolarAreaCard';
import { useRankingPageLayout, useCarouselStyle} from '../../organisms/mainpage/ranking/style/RankingPage.style';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Carousel from 'react-material-ui-carousel'


export default function Ranking(): JSX.Element {
  const wrapper = useRankingPageLayout();
  const carousel = useCarouselStyle();
  const memoAppbar = useMemo(() => <Appbar />, []);
  const memoFooter = useMemo(() => <Footer />, []);


  return (
    <div>
      {memoAppbar}
      <ProductHero title="인방랭킹" content="아프리카 vs 트위치 랭킹 비교" />
      <div className={wrapper.background}>

        <Container className={wrapper.root}>
          <Grid container direction="column">

            <Grid item className={wrapper.top}>
              <Carousel
              NextIcon={<ArrowForwardIosIcon color="primary" className={carousel.buttonIcon}/>}
              PrevIcon={<ArrowBackIosIcon color="primary" className={carousel.buttonIcon}/>}
              indicators={false}
              animation="slide"
              autoPlay={false}
              navButtonsProps={{style: {backgroundColor:'transparent', transform: 'translateY(-2rem)'}, className: 'carousel-button'}}
              >
                <ViewerComparisonPolarAreaCard />
                <WeeklyViewerRankingCard />
              </Carousel>
            </Grid>

            <Grid item container spacing={2}>
              <Grid item xs={8} className={wrapper.left}>
                <TopTenCard />
              </Grid>
              <Grid item xs={4} className={wrapper.right}>
                <MonthlyScoresRankingCard />
                <UserReactionCard />
              </Grid>
            </Grid>

          </Grid>

        </Container>
      </div>
      {memoFooter}
    </div>

  );
}
