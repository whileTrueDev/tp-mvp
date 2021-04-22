import {
  Button,
  Grid, Tab, Tabs, Typography,
} from '@material-ui/core';

import { RankingDataType } from '@truepoint/shared/dist/res/RankingsResTypes.interface';
import useAxios from 'axios-hooks';
import dayjs from 'dayjs';
import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import AdmireIcon from '../../../atoms/svgIcons/AdmireIcon';
import SmileIcon from '../../../atoms/svgIcons/SmileIcon';
import CussIcon from '../../../atoms/svgIcons/CussIcon';
import FrustratedIcon from '../../../atoms/svgIcons/FrustratedIcon';
import TVIcon from '../../../atoms/svgIcons/TVIcon';
import {
  useTabItem, useTabs, useTopTenCard, useHorizontalTabItemStyle, useHorizontalTabsStyle,
  usePlatformTabsStyle, usePlatformTabItemStyle,
} from './style/TopTenCard.style';
import TopTenListContainer from './topten/TopTenListContainer';

type MainTabName = 'admire'|'smile'|'cuss'|'frustrate'|'viewer';
type MainTabColumns = {
  column: MainTabName;
  label: string;
  icon?: string | React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
  className?: string
}

// 하위 카테고리 탭 목록
const categoryTabColumns = [
  { categoryId: 1, label: '버라이어티 BJ' },
  { categoryId: 2, label: '종합게임엔터 BJ' },
  { categoryId: 3, label: '보이는 라디오 BJ' },
  { categoryId: 4, label: '롤 BJ' },
  { categoryId: 5, label: '주식투자' },
];

type PlatformFilterType = 'all' | 'twitch' | 'afreeca';
// 플랫폼 필터 탭 목록
const platformTabColumns: {label: string, platform: PlatformFilterType}[] = [
  { label: '전체', platform: 'all' },
  { label: '트위치', platform: 'twitch' },
  { label: '아프리카', platform: 'afreeca' },
];

interface loadDataArgs {
  column: string;
  categoryId: number;
  platform: PlatformFilterType;
}

function TopTenCard(): JSX.Element {
  // 스타일
  const classes = useTopTenCard();
  const verticalTabsStyles = useTabs();
  const verticalTabItemStyles = useTabItem();
  const horizontalTabItemStyle = useHorizontalTabItemStyle();
  const horizontalTabsStyle = useHorizontalTabsStyle();
  const platformTabsStyle = usePlatformTabsStyle();
  const platformTabItemStyle = usePlatformTabItemStyle();
  const tabRef = useRef<any>(null);
  // 탭목록
  const mainTabColumns: MainTabColumns[] = useMemo(() => (
    [
      {
        column: 'viewer', label: '평균 시청자수', className: classes.viewerTab, icon: <TVIcon />,
      },
      { column: 'admire', label: '감탄점수', icon: <AdmireIcon /> },
      { column: 'smile', label: '웃음점수', icon: <SmileIcon /> },
      { column: 'frustrate', label: '답답함점수', icon: <FrustratedIcon /> },
      { column: 'cuss', label: '욕점수', icon: <CussIcon /> },

    ]
  ), [classes.viewerTab]);

  // axios요청
  // 탭 별 상위 10인 요청
  const [{ data, loading, error }, refetch] = useAxios<RankingDataType>({
    url: '/rankings/top-ten',
    params: {
      column: mainTabColumns[0].column,
      skip: 0,
      categoryId: categoryTabColumns[0].categoryId,
    },
  });
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
  const [dataToDisplay, setDataToDisplay] = useState<Omit<RankingDataType, 'totalDataCount'>>({
    rankingData: [],
    weeklyTrends: {},
  });

  const loadData = useCallback((args: loadDataArgs) => {
    const { column, categoryId, platform } = args;
    refetch({
      params: {
        column,
        skip: 0,
        categoryId,
        platform,
      },
    }).then((res) => {
      setDataToDisplay(res.data);
    }).catch((e) => {
      console.error(e);
    });
  }, [refetch]);

  const onMainTabChange = useCallback((event: React.ChangeEvent<unknown>, index: number) => {
    setMainTabIndex(index);
    const { column } = mainTabColumns[index];
    const { categoryId } = categoryTabColumns[categoryTabIndex];
    const { platform } = platformTabColumns[platformTabIndex];
    loadData({ column, categoryId, platform });

    if (column === 'viewer') {
      setWeeklyGraphLabel('주간 시청자수 추이');
    } else {
      setWeeklyGraphLabel('주간 점수 그래프');
    }
  }, [mainTabColumns, categoryTabIndex, platformTabIndex, loadData]);

  const onCategoryTabChange = useCallback((event: React.ChangeEvent<unknown>, index: number) => {
    setCategoryTabIndex(index);
    const { column } = mainTabColumns[mainTabIndex];
    const { categoryId } = categoryTabColumns[index];
    const { platform } = platformTabColumns[platformTabIndex];

    loadData({ column, categoryId, platform });
  }, [loadData, mainTabColumns, mainTabIndex, platformTabIndex]);

  const onPlatformTabChange = useCallback((event: React.ChangeEvent<unknown>, index: number) => {
    setPlatformTabIndex(index);
    const { column } = mainTabColumns[mainTabIndex];
    const { categoryId } = categoryTabColumns[categoryTabIndex];
    const { platform } = platformTabColumns[index];

    loadData({ column, categoryId, platform });
  }, [categoryTabIndex, loadData, mainTabColumns, mainTabIndex]);

  const loadMoreData = useCallback(() => {
    refetch({
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
      }));
    }).catch((e) => {
      console.error(e);
    });
  }, [categoryTabIndex, dataToDisplay.rankingData.length, mainTabColumns, mainTabIndex, platformTabIndex, refetch]);

  useEffect(() => {
    // mui-tabs기본스타일 덮어쓰기위해 인라인스타일 적용
    if (tabRef.current && tabRef.current.querySelector('.MuiTabs-scroller')) {
      tabRef.current.querySelector('.MuiTabs-scroller').setAttribute('style', 'overflow: visible;');
    }
    const { column } = mainTabColumns[mainTabIndex];
    const { categoryId } = categoryTabColumns[categoryTabIndex];
    const { platform } = platformTabColumns[platformTabIndex];

    // 초기 데이터 불러옴
    loadData({ column, categoryId, platform });
  // 마운트 이후 한번만 실행될 훅
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    console.error(error);
  }
  return (
    <>
      <Typography className={classes.recentAnalysisDate}>
        {recentAnalysisDate ? `${dayjs(recentAnalysisDate).format('YYYY-MM-DD')} 기준` : ' '}
      </Typography>
      <Grid container component="section" className={classes.topTenWrapper}>
        <Grid item xs={2} className={classes.left}>
          <header className={classes.header}>
            <Typography>반응별 랭킹</Typography>
            <Typography variant="h4">TOP 10</Typography>
          </header>
          <Tabs
            style={{ overflow: 'visible' }} // mui-tabs기본스타일 덮어쓰기위해 인라인스타일 적용
            classes={verticalTabsStyles}
            orientation="vertical"
            value={mainTabIndex}
            onChange={onMainTabChange}
            ref={tabRef}
          >
            {mainTabColumns.map((c) => (
              <Tab
                disableRipple
                classes={verticalTabItemStyles}
                key={c.column}
                icon={c.icon}
                label={c.label}
                className={c.className}
              />
            ))}
          </Tabs>
        </Grid>
        <Grid item xs={10}>
          <Grid container justify="flex-end">
            <Tabs
              classes={platformTabsStyle}
              value={platformTabIndex}
              onChange={onPlatformTabChange}
            >
              {platformTabColumns.map((col) => (
                <Tab classes={platformTabItemStyle} key={col.platform} label={col.label} />
              ))}
            </Tabs>
          </Grid>
          <Grid container justify="center">
            <Tabs
              variant="scrollable"
              scrollButtons="auto"
              classes={horizontalTabsStyle}
              value={categoryTabIndex}
              onChange={onCategoryTabChange}
            >
              {categoryTabColumns.map((col) => (
                <Tab
                  key={col.categoryId}
                  classes={horizontalTabItemStyle}
                  disableRipple
                  label={col.label}
                />
              ))}
            </Tabs>
          </Grid>

          <TopTenListContainer
            data={dataToDisplay}
            currentTab={mainTabColumns[mainTabIndex].column}
            loading={loading}
            error={error}
            weeklyGraphLabel={weeklyGraphLabel}
          />
          <div className={classes.loadMoreButtonContainer}>
            { data && (data.totalDataCount > dataToDisplay.rankingData.length)
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
