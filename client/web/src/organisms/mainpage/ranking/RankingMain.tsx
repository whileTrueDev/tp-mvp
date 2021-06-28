import { Container, Grid } from '@material-ui/core';
import React from 'react';
import Carousel from 'react-material-ui-carousel';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useCarouselStyle, useRankingPageLayout } from './style/RankingPage.style';
import TopTenCard from './ToptenCard';
import RatingsList from './RatingsList';
import UserReactionCard from './UserReactionCard';
import ViewerComparisonPolarAreaCard from './ViewerComparisonPolarAreaCard';
import WeeklyLineCard from './WeeklyLineCard';
import useMediaSize from '../../../utils/hooks/useMediaSize';
import SearchGuideBannerSlide from './sub/SearchGuideBannerSlide';
import PageTitle from '../shared/PageTitle';
import FirstPlaceCreators from './sub/FirstPlaceCreators';
import RankingPageCommonLayout from './RankingPageCommonLayout';
import RatingGuideBannerSlide from './sub/RatingGuideBannerSlide';

export function CarouselSection(): JSX.Element {
  const carousel = useCarouselStyle();
  const wrapper = useRankingPageLayout();
  return (
    <div className={wrapper.top}>
      <Container className={wrapper.container}>
        <Carousel
          NextIcon={<ArrowForwardIosIcon className={carousel.buttonIcon} />}
          PrevIcon={<ArrowBackIosIcon className={carousel.buttonIcon} />}
          animation="slide"
          indicators={false}
          autoPlay
          interval={5000}
          navButtonsProps={{
            style: {
              backgroundColor: 'transparent',
              transform: 'translateY(-1rem)',
              opacity: 0.8,
            },
            className: 'carousel-button',
          }}
        >
          <FirstPlaceCreators />
          <RatingGuideBannerSlide />
          <SearchGuideBannerSlide />
          <ViewerComparisonPolarAreaCard />
          <WeeklyLineCard />
        </Carousel>
      </Container>
    </div>
  );
}

export default function RankingMain(): JSX.Element {
  const wrapper = useRankingPageLayout();
  const { isMobile } = useMediaSize();
  return (
    <RankingPageCommonLayout>
      {!isMobile && <CarouselSection />}
      <PageTitle text="인방랭킹" />

      <Container className={wrapper.container}>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8} className={wrapper.left}>
            <TopTenCard />
          </Grid>
          <Grid item xs={12} md={4} className={wrapper.right}>
            <RatingsList />
            <UserReactionCard />
          </Grid>
        </Grid>
      </Container>

    </RankingPageCommonLayout>
  );
}
