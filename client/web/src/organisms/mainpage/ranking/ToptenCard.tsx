import {
  Button, Card, Grid, Typography,
} from '@material-ui/core';

import useAxios from 'axios-hooks';
import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import AdmireIcon from '../../../atoms/svgIcons/AdmireIcon';
import SmileIcon from '../../../atoms/svgIcons/SmileIcon';
import CussIcon from '../../../atoms/svgIcons/CussIcon';
import FrustratedIcon from '../../../atoms/svgIcons/FrustratedIcon';
import TVIcon from '../../../atoms/svgIcons/TVIcon';
import { useTopTenCard } from './style/TopTenCard.style';
import TopTenListContainer from './topten/TopTenListContainer';
import { CategoryTab, MainTab, PlatformTab } from './topten/filter';
import useMediaSize from '../../../utils/hooks/useMediaSize';
import { dayjsFormatter } from '../../../utils/dateExpression';
import RankingDropDown from './topten/filter/RankingDropDown';
import useToptenList from '../../../utils/hooks/query/useToptenList';
import useCreatorCategoryTabs from '../../../utils/hooks/query/useCreatorCategoryTab';
import useRecentAnalysisDate from '../../../utils/hooks/query/useRecentAnalysisDate';

export const Icons = {
  viewer: <TVIcon />,
  rating: <StarBorderIcon />,
  admire: <AdmireIcon />,
  smile: <SmileIcon />,
  frustrate: <FrustratedIcon />,
  cuss: <CussIcon />,
};

export type MainTabName = keyof typeof Icons;
type MainTabColumns = {
  column: MainTabName;
  label: string;
  icon?: string | React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
  className?: string
}

// 탭목록
const mainTabColumns: MainTabColumns[] = [
  { column: 'viewer' as const, label: '최고 시청자수' },
  { column: 'rating' as const, label: '시청자 평점' },
  { column: 'admire' as const, label: '감탄 많은 방송' },
  { column: 'smile' as const, label: '웃음 많은 방송' },
  { column: 'frustrate' as const, label: '답답한 방송' },
  { column: 'cuss' as const, label: '욕많은 방송' },
].map((col) => ({ ...col, icon: Icons[col.column] }));

type PlatformFilterType = 'all' | 'twitch' | 'afreeca';
// 플랫폼 필터 탭 목록
const platformTabColumns: {label: string, platform: PlatformFilterType}[] = [
  { label: '전체', platform: 'all' },
  { label: '아프리카', platform: 'afreeca' },
  { label: '트위치', platform: 'twitch' },
];

function TopTenCard(): JSX.Element {
  const { isMobile } = useMediaSize();
  // 스타일
  const classes = useTopTenCard();
  const scrollRef = useRef<any>(null);

  const [categoryTabColumns, setCategoryTabColumns] = useState<{categoryId: number, label: string}[]>([
    { categoryId: 0, label: '전체' },
  ]);

  // 최근 분석날짜 요청
  const { data: recentAnalysisDate } = useRecentAnalysisDate();

  // states
  // 메인 탭에서 선택된 탭의 인덱스
  const [mainTabIndex, setMainTabIndex] = useState<number>(0);
  // 하위카테고리 탭에서 선택된 탭의 인덱스
  const [categoryTabIndex, setCategoryTabIndex] = useState<number>(0);
  // 플랫폼 탭에서 선택된 탭의 인덱스
  const [platformTabIndex, setPlatformTabIndex] = useState<number>(0);
  // 랭킹목록 순위, 이름, 다음에 나오는 '주간 점수 그래프 | 주간 시청자수 그래프' 부분
  const [weeklyGraphLabel, setWeeklyGraphLabel] = useState<string>('주간 점수 그래프');

  // 탭 별 상위 10인 요청
  const {
    data,
    error: queryError,
    fetchNextPage,
    isFetching,
  } = useToptenList({
    column: mainTabColumns[mainTabIndex].column,
    categoryId: categoryTabColumns[categoryTabIndex].categoryId,
    platform: platformTabColumns[platformTabIndex].platform,
    skip: 0,
  });

  // 보여줄 데이터
  const datalist = useMemo(() => (data
    ? data.pages.reduce((acc, cur) => ({
      rankingData: [...acc.rankingData, ...cur.rankingData],
      weeklyTrends: { ...acc.weeklyTrends, ...cur.weeklyTrends },
      totalDataCount: cur.totalDataCount,
    }), { rankingData: [], weeklyTrends: {}, totalDataCount: 0 })
    : { rankingData: [], weeklyTrends: {}, totalDataCount: 0 }), [data]);

  const changeMain = useCallback((index: number) => {
    setMainTabIndex(index);
    const { column } = mainTabColumns[index];

    if (column === 'viewer') {
      setWeeklyGraphLabel('주간 시청자수 추이');
    } else if (column === 'rating') {
      setWeeklyGraphLabel('일일 평균 평점 추이');
    } else {
      setWeeklyGraphLabel('주간 점수 그래프');
    }
  }, []);

  const changeCategory = useCallback((index: number) => {
    setCategoryTabIndex(index);
  }, []);

  const changePlatform = useCallback((index: number) => {
    setPlatformTabIndex(index);
  }, []);

  const loadMoreData = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const { data: categoriesFromDB } = useCreatorCategoryTabs();

  useEffect(() => {
    if (categoriesFromDB) {
      const categories = categoriesFromDB
        .map((c) => ({ categoryId: c.categoryId, label: c.name }));

      setCategoryTabColumns((prev) => ([...prev, ...categories]));
    }

    return () => {
      setCategoryTabColumns([
        { categoryId: 0, label: '전체' },
      ]);
    };
  }, [categoriesFromDB]);

  const toptenListContainer = useMemo(() => (
    <TopTenListContainer
      data={datalist}
      currentTab={mainTabColumns[mainTabIndex].column}
      loading={isFetching}
      error={queryError}
      weeklyGraphLabel={weeklyGraphLabel}
    />
  ), [datalist, isFetching, mainTabIndex, queryError, weeklyGraphLabel]);

  const loadMoreButton = useMemo(() => (
    <div className={classes.loadMoreButtonContainer}>
      { (datalist.rankingData.length !== 0)
            && (datalist.totalDataCount > datalist.rankingData.length)
        ? (
          <Button
            className={classes.loadMoreButton}
            onClick={loadMoreData}
            variant="outlined"
            color="primary"
          >
            더보기
          </Button>
        )
        : null}
    </div>
  ), [classes.loadMoreButton, classes.loadMoreButtonContainer,
    datalist.rankingData.length, datalist.totalDataCount, loadMoreData]);

  if (queryError) {
    console.error(queryError);
  }

  if (isMobile) {
    return (
      <Card>
        <div style={{ display: 'flex', padding: '4px' }}>
          <RankingDropDown id="main" columns={mainTabColumns} index={mainTabIndex} changeHandler={changeMain} />
          <RankingDropDown id="category" columns={categoryTabColumns} index={categoryTabIndex} changeHandler={changeCategory} />
          <RankingDropDown id="platform" columns={platformTabColumns} index={platformTabIndex} changeHandler={changePlatform} />
        </div>
        {toptenListContainer}
        {loadMoreButton}
      </Card>
    );
  }
  return (
    <>
      <Typography className={classes.recentAnalysisDate}>
        {recentAnalysisDate
          ? `${dayjsFormatter(recentAnalysisDate, 'date-only')} 기준`
          : ' '}
      </Typography>
      <Grid ref={scrollRef} container component="section" className={classes.topTenWrapper}>
        <Grid item xs={2} className={classes.left}>
          <header className={classes.header}>
            <Typography>반응별 랭킹</Typography>
            <Typography variant="h4">TOP 10</Typography>
          </header>
          <MainTab
            value={mainTabIndex}
            onTabChange={changeMain}
            columns={mainTabColumns}
          />
        </Grid>
        <Grid item xs={10}>
          <Grid container justify="flex-end">
            <PlatformTab
              value={platformTabIndex}
              onTabChange={changePlatform}
              columns={platformTabColumns}
            />
          </Grid>
          <Grid container justify="center">
            <CategoryTab
              value={categoryTabIndex}
              onTabChange={changeCategory}
              columns={categoryTabColumns}
            />
          </Grid>

          {toptenListContainer}

          {/* 위로 버튼 */}
          <Button
            startIcon={<ArrowUpwardIcon />}
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollIntoView();
              }
            }}
          >
            위로 이동
          </Button>
          {loadMoreButton}
        </Grid>
      </Grid>
    </>
  );
}

export default TopTenCard;
