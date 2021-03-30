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
import { useRankingPageLayout } from '../../organisms/mainpage/ranking/style/RankingPage.style';

export default function Ranking(): JSX.Element {
  const wrapper = useRankingPageLayout();
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
              <ViewerComparisonPolarAreaCard />
            </Grid>

            <Grid item container spacing={2}>
              <Grid item xs={8} className={wrapper.left}>
                <TopTenCard />
              </Grid>
              <Grid item xs={4} className={wrapper.right}>
                <MonthlyScoresRankingCard />
                <WeeklyViewerRankingCard />
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
