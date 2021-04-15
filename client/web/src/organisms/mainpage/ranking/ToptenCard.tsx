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
} from './style/TopTenCard.style';
import TopTenListContainer from './topten/TopTenListContainer';

type MainTabName = 'admire'|'smile'|'cuss'|'frustrate'|'viewer';
type MainTabColumns = {
  name: MainTabName;
  label: string;
  icon?: string | React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
  className?: string
}

// 하위 카테고리 탭 목록
const categoryTabColumns = [
  { categoryId: 1, name: '버라이어티 BJ', icon: <TVIcon /> },
  { categoryId: 2, name: '종합게임엔터 BJ', icon: <TVIcon /> },
  { categoryId: 3, name: '보이는 라디오 BJ', icon: <TVIcon /> },
  { categoryId: 4, name: '롤 BJ', icon: <TVIcon /> },
  { categoryId: 5, name: '주식투자', icon: <TVIcon /> },
];
function TopTenCard(): JSX.Element {
  // 스타일
  const classes = useTopTenCard();
  const verticalTabsStyles = useTabs();
  const verticalTabItemStyles = useTabItem();
  const horizontalTabItemStyle = useHorizontalTabItemStyle();
  const horizontalTabsStyle = useHorizontalTabsStyle();

  const tabRef = useRef<any>(null);
  // 탭목록
  const mainTabColumns: MainTabColumns[] = useMemo(() => (
    [
      {
        name: 'viewer', label: '최고 시청자수', className: classes.viewerTab, icon: <TVIcon />,
      },
      { name: 'admire', label: '감탄점수', icon: <AdmireIcon /> },
      { name: 'smile', label: '웃음점수', icon: <SmileIcon /> },
      { name: 'frustrate', label: '답답함점수', icon: <FrustratedIcon /> },
      { name: 'cuss', label: '욕점수', icon: <CussIcon /> },

    ]
  ), [classes.viewerTab]);

  // axios요청
  // 탭 별 상위 10인 요청
  const [{ data, loading, error }, refetch] = useAxios<RankingDataType>({
    url: '/rankings/top-ten',
    params: {
      column: mainTabColumns[0].name,
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
  // 랭킹목록 순위, 이름, 다음에 나오는 '주간 점수 그래프 | 주간 시청자수 그래프' 부분
  const [weeklyGraphLabel, setWeeklyGraphLabel] = useState<string>('주간 점수 그래프');
  // 보여줄 데이터 상태
  const [dataToDisplay, setDataToDisplay] = useState<Omit<RankingDataType, 'totalDataCount'>>({
    rankingData: [],
    weeklyTrends: {},
  });

  const loadData = useCallback((column: string, categoryId: number) => {
    refetch({
      params: {
        column,
        skip: 0,
        categoryId,
      },
    }).then((res) => {
      setDataToDisplay(res.data);
    }).catch((e) => {
      console.error(e);
    });
  }, [refetch]);

  const onMainTabChange = useCallback((event: React.ChangeEvent<unknown>, index: number) => {
    setMainTabIndex(index);
    const currentTabName = mainTabColumns[index].name;
    const currentCategoryId = categoryTabColumns[categoryTabIndex].categoryId;

    loadData(currentTabName, currentCategoryId);

    if (currentTabName === 'viewer') {
      setWeeklyGraphLabel('주간 시청자수 추이');
    } else {
      setWeeklyGraphLabel('주간 점수 그래프');
    }
  }, [mainTabColumns, loadData, categoryTabIndex]);

  const onCategoryTabChange = useCallback((event: React.ChangeEvent<unknown>, index: number) => {
    setCategoryTabIndex(index);
    const currentTabName = mainTabColumns[mainTabIndex].name;
    const currentCategoryId = categoryTabColumns[index].categoryId;

    loadData(currentTabName, currentCategoryId);
  }, [loadData, mainTabColumns, mainTabIndex]);

  const loadMoreData = useCallback(() => {
    refetch({
      params: {
        column: mainTabColumns[mainTabIndex].name,
        skip: dataToDisplay.rankingData.length,
        categoryId: categoryTabColumns[categoryTabIndex].categoryId,
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
  }, [categoryTabIndex, dataToDisplay.rankingData.length, mainTabColumns, mainTabIndex, refetch]);

  useEffect(() => {
    // mui-tabs기본스타일 덮어쓰기위해 인라인스타일 적용
    if (tabRef.current && tabRef.current.querySelector('.MuiTabs-scroller')) {
      tabRef.current.querySelector('.MuiTabs-scroller').setAttribute('style', 'overflow: visible;');
    }
    // 초기 데이터 불러옴
    loadData(mainTabColumns[mainTabIndex].name, categoryTabColumns[categoryTabIndex].categoryId);
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
                key={c.name}
                icon={c.icon}
                label={c.label}
                className={c.className}
              />
            ))}
          </Tabs>
        </Grid>
        <Grid item xs={10}>
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
                icon={col.icon}
                label={col.name}
              />
            ))}
          </Tabs>
          <TopTenListContainer
            data={dataToDisplay}
            currentTab={mainTabColumns[mainTabIndex].name}
            loading={loading}
            error={error}
            weeklyGraphLabel={weeklyGraphLabel}
          />
          <div className={classes.loadMoreButtonContainer}>
            { data && (data.totalDataCount > dataToDisplay.rankingData.length)
              ? <Button onClick={loadMoreData} variant="contained" color="primary">더보기</Button>
              : null}
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default TopTenCard;
