import React, { useMemo, useState, useEffect } from 'react';
import { Container, Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
// import useAxios from 'axios-hooks';
import Appbar from '../../organisms/shared/Appbar';
import Footer from '../../organisms/shared/footer/Footer';
import ProductHero from '../../organisms/mainpage/shared/ProductHero';
import UserReactionCard from '../../organisms/mainpage/ranking/UserReactionCard';
import WeeklyViewerRankingCard from '../../organisms/mainpage/ranking/WeeklyViewerRankingCard';

const useRankingPageLayout = makeStyles((theme: Theme) => createStyles({
  root: {
    minWidth: '1400px',
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
  userReaction: {
    background: 'green',
    height: '300px',
  },

}));

// 임시데이터 - 백엔드와 연결이후 삭제예정
const dummyWeeklyData = {
  afreeca: [
    { date: '2021-3-5', totalViewer: 134321 },
    { date: '2021-3-4', totalViewer: 123411 },
    { date: '2021-3-3', totalViewer: 134531 },
    { date: '2021-3-2', totalViewer: 121351 },
    { date: '2021-3-1', totalViewer: 123451 },
    { date: '2021-2-28', totalViewer: 126421 },
    { date: '2021-2-27', totalViewer: 134561 },
  ],
  twitch: [
    { date: '2021-3-5', totalViewer: 109382 },
    { date: '2021-3-4', totalViewer: 113452 },
    { date: '2021-3-3', totalViewer: 124532 },
    { date: '2021-3-2', totalViewer: 111352 },
    { date: '2021-3-1', totalViewer: 113452 },
    { date: '2021-2-28', totalViewer: 116422 },
    { date: '2021-2-27', totalViewer: 124562 },
  ],
};

export default function Ranking(): JSX.Element {
  const wrapper = useRankingPageLayout();
  const memoAppbar = useMemo(() => <Appbar />, []);
  const memoFooter = useMemo(() => <Footer />, []);

  // const [{ loading: WeeklyDataLoading }, getWeeklyData] = useAxios({ url: '/rankings/weekly-viewers' }, { manual: true });
  // 백엔드와 연결이후 바로 윗줄 코드와 교체예정
  const [weeklyData, setWeeklyData] = useState<any>({ afreeca: [], twitch: [] });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timeoutID = window.setTimeout(() => {
      setWeeklyData(dummyWeeklyData);
      setLoading(false);
    }, 3000);

    return () => window.clearTimeout(timeoutID);

    // 백엔드 코드 수정후 합칠 예정
    // getWeeklyData().then((res) => {
    //   setWeeklyData(res.data);
    // }).catch((error) => {
    //   // 에러핸들링
    //   console.error(error);
    // });
  }, []);

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
              <WeeklyViewerRankingCard
                data={weeklyData}
                loading={loading}
                // loading={WeeklyDatLoading}
              />
              <UserReactionCard />
            </Grid>
          </Grid>
        </Grid>

      </Container>
      {memoFooter}
    </div>

  );
}
