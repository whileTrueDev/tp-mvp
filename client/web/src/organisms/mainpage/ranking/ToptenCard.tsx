import {
  Button, Card, Grid, Typography,
} from '@material-ui/core';

import { RankingDataType } from '@truepoint/shared/dist/res/RankingsResTypes.interface';
import useAxios, { RefetchOptions } from 'axios-hooks';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import AdmireIcon from '../../../atoms/svgIcons/AdmireIcon';
import SmileIcon from '../../../atoms/svgIcons/SmileIcon';
import CussIcon from '../../../atoms/svgIcons/CussIcon';
import FrustratedIcon from '../../../atoms/svgIcons/FrustratedIcon';
import TVIcon from '../../../atoms/svgIcons/TVIcon';
import { useTopTenCard } from './style/TopTenCard.style';
import TopTenListContainer from './topten/TopTenListContainer';
import axios from '../../../utils/axios';
import { CategoryTab, MainTab, PlatformTab } from './topten/filter';
import useMediaSize from '../../../utils/hooks/useMediaSize';
import { dayjsFormatter } from '../../../utils/dateExpression';
import RankingDropDown from './topten/filter/RankingDropDown';

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

type loadDataArgs = {
  column: MainTabName;
  categoryId: number;
  platform: PlatformFilterType;
}

function TopTenCard(): JSX.Element {
  const { isMobile } = useMediaSize();
  // 스타일
  const classes = useTopTenCard();
  const tabRef = useRef<any>(null);
  const scrollRef = useRef<any>(null);

  const [categoryTabColumns, setCategoryTabColumns] = useState<{categoryId: number, label: string}[]>([
    { categoryId: 0, label: '전체' },
  ]);

  // axios요청
  // 탭 별 상위 10인 요청
  const [{ loading, error }, refetch] = useAxios<RankingDataType>({
    url: '/rankings/top-ten',
  }, { manual: true });
  // 시청자 평점 탭(일일평점) 요청
  const [{
    loading: dailyRatingLoading,
    error: dailyRatingError,
  }, getDailyRatingData] = useAxios<RankingDataType>({
    url: '/ratings/daily-ranking',
  }, { manual: true });

  // 최근 분석날짜 요청
  const [{ data: recentAnalysisDate },
  ] = useAxios<Date>('/rankings/recent-analysis-date');

  // states
  // 메인 탭에서 선택된 탭의 인덱스
  const [mainTabIndex, setMainTabIndex] = useState<number>(0);
  // 하위카테고리 탭에서 선택된 탭의 인덱스
  const [categoryTabIndex, setCategoryTabIndex] = useState<number>(0);
  // 플랫폼 탭에서 선택된 탭의 인덱스
  const [platformTabIndex, setPlatformTabIndex] = useState<number>(0);
  // 랭킹목록 순위, 이름, 다음에 나오는 '주간 점수 그래프 | 주간 시청자수 그래프' 부분
  const [weeklyGraphLabel, setWeeklyGraphLabel] = useState<string>('주간 점수 그래프');
  // 보여줄 데이터 상태
  const [dataToDisplay, setDataToDisplay] = useState<RankingDataType>({
    rankingData: [],
    weeklyTrends: {},
    totalDataCount: 0,
  });
  // 탭변경 로딩
  const [tabChangeLoading, setTabChangeLoading] = useState<boolean>(false);

  const loadData = useCallback((args: loadDataArgs) => {
    const { column, categoryId, platform } = args;
    let request: (config?: AxiosRequestConfig | undefined,
      options?: RefetchOptions | undefined) => AxiosPromise<RankingDataType>;
    setTabChangeLoading(true);

    if (column === 'rating') {
      request = getDailyRatingData;
    } else {
      request = refetch;
    }
    request({
      params: {
        column,
        skip: 0,
        categoryId,
        platform,
      },
    }).then((res) => {
      setDataToDisplay(res.data);
      setTabChangeLoading(false);
    }).catch((e) => {
      console.error(e);
      setTabChangeLoading(false);
    });
  }, [getDailyRatingData, refetch]);

  const changeMain = useCallback((index: number) => {
    setMainTabIndex(index);
    const { column } = mainTabColumns[index];
    const { categoryId } = categoryTabColumns[categoryTabIndex];
    const { platform } = platformTabColumns[platformTabIndex];
    loadData({ column, categoryId, platform });

    if (column === 'viewer') {
      setWeeklyGraphLabel('주간 시청자수 추이');
    } else if (column === 'rating') {
      setWeeklyGraphLabel('일일 평균 평점 추이');
    } else {
      setWeeklyGraphLabel('주간 점수 그래프');
    }
  }, [categoryTabColumns, categoryTabIndex, loadData, platformTabIndex]);

  const changeCategory = useCallback((index: number) => {
    setCategoryTabIndex(index);
    const { column } = mainTabColumns[mainTabIndex];
    const { categoryId } = categoryTabColumns[index];
    const { platform } = platformTabColumns[platformTabIndex];

    loadData({ column, categoryId, platform });
  }, [categoryTabColumns, loadData, mainTabIndex, platformTabIndex]);

  const changePlatform = useCallback((index: number) => {
    setPlatformTabIndex(index);
    const { column } = mainTabColumns[mainTabIndex];
    const { categoryId } = categoryTabColumns[categoryTabIndex];
    const { platform } = platformTabColumns[index];

    loadData({ column, categoryId, platform });
  }, [categoryTabColumns, categoryTabIndex, loadData, mainTabIndex]);

  const loadMoreData = useCallback(() => {
    let request: (config?: AxiosRequestConfig | undefined,
      options?: RefetchOptions | undefined) => AxiosPromise<RankingDataType>;

    if (mainTabColumns[mainTabIndex].column === 'rating') {
      request = getDailyRatingData;
    } else {
      request = refetch;
    }
    request({
      params: {
        column: mainTabColumns[mainTabIndex].column,
        skip: dataToDisplay.rankingData.length,
        categoryId: categoryTabColumns[categoryTabIndex].categoryId,
        platform: platformTabColumns[platformTabIndex].platform,
      },
    }).then((res) => {
      const newData = res.data;
      setDataToDisplay((prev) => ({
        rankingData: [...prev.rankingData, ...newData.rankingData],
        weeklyTrends: { ...prev.weeklyTrends, ...newData.weeklyTrends },
        totalDataCount: newData.totalDataCount,
      }));
    }).catch((e) => {
      console.error(e);
    });
  }, [categoryTabColumns, categoryTabIndex, dataToDisplay.rankingData.length,
    getDailyRatingData, mainTabIndex, platformTabIndex, refetch]);

  const loadCategories = () => {
    axios.get('/creator-category')
      .then((res) => {
        const data = res.data.map((d: {categoryId: number; name: string;}) => (
          { categoryId: d.categoryId, label: d.name }
        ));
        setCategoryTabColumns((prev) => ([...prev, ...data]));
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    // mui-tabs기본스타일 덮어쓰기위해 인라인스타일 적용
    if (tabRef.current && tabRef.current.querySelector('.MuiTabs-scroller')) {
      tabRef.current.querySelector('.MuiTabs-scroller').setAttribute('style', 'overflow: visible;');
    }
    // const { column } = currentMainTab;
    // const { categoryId } = currentCategoryTab;
    // const { platform } = currentPlatformTab;
    const { column } = mainTabColumns[mainTabIndex];
    const { categoryId } = categoryTabColumns[categoryTabIndex];
    const { platform } = platformTabColumns[platformTabIndex];

    // 초기 데이터 불러옴
    loadData({ column, categoryId, platform });
    // 크리에이터 카테고리 불러옴
    loadCategories();

  // 마운트 이후 한번만 실행될 훅
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    console.error(error);
  }

  const scrollToContainerTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView();
    }
  };

  if (isMobile) {
    return (
      <Card>
        <div style={{ display: 'flex', padding: '4px' }}>
          <RankingDropDown id="main" columns={mainTabColumns} index={mainTabIndex} changeHandler={changeMain} />
          <RankingDropDown id="category" columns={categoryTabColumns} index={categoryTabIndex} changeHandler={changeCategory} />
          <RankingDropDown id="platform" columns={platformTabColumns} index={platformTabIndex} changeHandler={changePlatform} />
        </div>

        <TopTenListContainer
          data={dataToDisplay}
          currentTab={mainTabColumns[mainTabIndex].column}
          loading={loading || dailyRatingLoading}
          tabChanging={tabChangeLoading}
          error={error || dailyRatingError}
          weeklyGraphLabel={weeklyGraphLabel}
        />
        <div className={classes.loadMoreButtonContainer}>
          { (dataToDisplay.rankingData.length !== 0)
            && (dataToDisplay.totalDataCount > dataToDisplay.rankingData.length)
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
      </Card>
    );
  }
  return (
    <>
      <Typography className={classes.recentAnalysisDate}>
        {recentAnalysisDate ? `${dayjsFormatter(recentAnalysisDate, 'date-only')} 기준` : ' '}
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

          <TopTenListContainer
            data={dataToDisplay}
            currentTab={mainTabColumns[mainTabIndex].column}
            loading={loading || dailyRatingLoading}
            tabChanging={tabChangeLoading}
            error={error || dailyRatingError}
            weeklyGraphLabel={weeklyGraphLabel}
          />
          {/* 위로 버튼 */}
          <Button
            startIcon={<ArrowUpwardIcon />}
            onClick={scrollToContainerTop}
          >
            위로 이동
          </Button>

          <div className={classes.loadMoreButtonContainer}>
            { (dataToDisplay.rankingData.length !== 0)
            && (dataToDisplay.totalDataCount > dataToDisplay.rankingData.length)
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
        </Grid>
      </Grid>
    </>
  );
}

export default TopTenCard;
