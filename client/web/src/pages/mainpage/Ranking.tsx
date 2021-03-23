import React, { useMemo } from 'react';
import { Container, Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Appbar from '../../organisms/shared/Appbar';
import Footer from '../../organisms/shared/footer/Footer';
import ProductHero from '../../organisms/mainpage/shared/ProductHero';
import UserReactionCard from '../../organisms/mainpage/ranking/UserReactionCard';
import WeeklyViewerRankingCard from '../../organisms/mainpage/ranking/WeeklyViewerRankingCard';
import MonthlyScoresRankingCard from '../../organisms/mainpage/ranking/MonthlyScoresRankingCard';
import TopTenCard from '../../organisms/mainpage/ranking/ToptenCard';
import ViewerComparisonPolarAreaCard from '../../organisms/mainpage/ranking/ViewerComparisonPolarAreaCard';

const useRankingPageLayout = makeStyles((theme: Theme) => createStyles({
  root: {
    minWidth: '1400px',
    border: '1px solid black',
    backgroundColor: theme.palette.grey[400],
  },
  top: {
    marginBottom: theme.spacing(2),
  },
  left: {},
  right: {
    '&>*+*': {
      marginTop: theme.spacing(2),
    },
  },
  // 아래 스타일은 실제 카드 컴포넌트에 적용되어야 함, 취합 후 삭제
  polarChart: {
    background: 'pink',
    height: '300px',
  },
  recentAnalysisDate: {},

}));

export default function Ranking(): JSX.Element {
  const wrapper = useRankingPageLayout();
  const memoAppbar = useMemo(() => <Appbar />, []);
  const memoFooter = useMemo(() => <Footer />, []);

  return (
    <div>
      {memoAppbar}
      <ProductHero title="인방랭킹" content="아프리카 vs 트위치 랭킹 비교" />
      <Container className={wrapper.root}>
        <Grid container direction="column" spacing={1}>
          <Grid item className={wrapper.top}>
            <ViewerComparisonPolarAreaCard />
          </Grid>
          <Grid item container spacing={1}>
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
      {memoFooter}
    </div>

  );
}
