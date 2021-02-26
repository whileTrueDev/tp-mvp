import React, { useMemo } from 'react';
import { Container, Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Appbar from '../../organisms/shared/Appbar';
import Footer from '../../organisms/shared/footer/Footer';
import ProductHero from '../../organisms/mainpage/shared/ProductHero';

const useRankingPageLayout = makeStyles((theme: Theme) => createStyles({
  root: {
    border: '1px solid black',
  },
  top: {},
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
  ranking: {
    background: 'orange',
    height: '100%',
  },
  monthlyScore: {
    background: 'blue',
    height: '300px',
  },
  weeklyViewer: {
    background: 'yellow',
    height: '300px',
  },
  userReaction: {
    background: 'green',
    height: '300px',
  },

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
            <section className={wrapper.polarChart}>
              아프리카, 트위치 시청자수 상위 10인 비교 폴라차트 위치
            </section>
          </Grid>
          <Grid item>
            {`${new Date()}`}
          </Grid>
          <Grid item container spacing={1}>
            <Grid item xs={8} className={wrapper.left}>
              <section className={wrapper.ranking}>
                인방랭킹목록 컴포넌트 위치
              </section>
            </Grid>
            <Grid item xs={4} className={wrapper.right}>
              <section className={wrapper.monthlyScore}>
                월간 점수
              </section>
              <section className={wrapper.weeklyViewer}>
                주간 시청자수 추이
              </section>
              <section className={wrapper.userReaction}>
                시청자반응
              </section>
            </Grid>
          </Grid>
        </Grid>

      </Container>
      {memoFooter}
    </div>

  );
}
