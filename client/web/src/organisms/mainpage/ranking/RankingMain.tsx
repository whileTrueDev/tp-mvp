import { Container, Grid } from '@material-ui/core';
import React, { useMemo } from 'react';
import Carousel from 'react-material-ui-carousel';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useCarouselStyle, useRankingPageLayout } from './style/RankingPage.style';
import FooterDecoration from './sub/FooterDecoration';
import TopTenCard from './ToptenCard';
import RatingsList from './RatingsList';
import UserReactionCard from './UserReactionCard';
import ViewerComparisonPolarAreaCard from './ViewerComparisonPolarAreaCard';
import WeeklyLineCard from './WeeklyLineCard';
import useMediaSize from '../../../utils/hooks/useMediaSize';
import SearchGuideBannerSlide from './sub/SearchGuideBannerSlide';
import PageTitle from '../shared/PageTitle';

export function CarouselSection(): JSX.Element {
  const carousel = useCarouselStyle();
  const wrapper = useRankingPageLayout();
  return (
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
  const footerDecoration = useMemo(() => <FooterDecoration />, []);
  return (
    <div>
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

      {!isMobile && footerDecoration}
    </div>
  );
}
