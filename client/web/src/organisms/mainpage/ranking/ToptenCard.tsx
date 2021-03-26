import {
  Button,
  Grid, Tab, Tabs, Typography,
} from '@material-ui/core';
import React, {
  useState, useRef, useEffect, useCallback,
} from 'react';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import useAxios from 'axios-hooks';
import dayjs from 'dayjs';
import { RankingDataType } from '@truepoint/shared/dist/res/RankingsResTypes.interface';
import {
  useTopTenCard, useTabs, useTabItem, useViewerTabButtonStyle,
} from './style/TopTenCard.style';
import TopTenListContainer from './topten/TopTenListContainer';

const columns = [
  { name: 'admire', label: '감탄점수', icon: <SentimentVerySatisfiedIcon /> },
  { name: 'smile', label: '웃음점수', icon: <SentimentSatisfiedAltIcon /> },
  { name: 'frustrate', label: '답답함점수', icon: <SentimentDissatisfiedIcon /> },
  { name: 'cuss', label: '욕점수', icon: <SentimentVeryDissatisfiedIcon /> },
];
function TopTenCard(): JSX.Element {
  // 스타일
  const classes = useTopTenCard();
  const tabsStyles = useTabs();
  const mainTabItemStyles = useTabItem();
  const viewerTabButtonStyles = useViewerTabButtonStyle();

  const tabRef = useRef<any>(null);

  // axios요청
  // 탭 별 상위 10인 요청
  const [{ data, loading, error }, refetch] = useAxios<RankingDataType>({
    url: '/rankings/top-ten',
    params: { column: columns[0].name, skip: 0 },
  });
    // 최근 분석날짜 요청
  const [{ data: recentAnalysisDate },
  ] = useAxios<Date>('/rankings/recent-analysis-date');

  // states
  const [tabIndex, setTabIndex] = useState(0); // 선택된 탭의 인덱스
  const [currentTab, setCurrentTab] = useState<string>(''); // 현재 탭 이름 admire, smile ... 
  // -> topTenContainer에게 넘겨주기 위함, 해당 prop은 Score글자를 붙여서 topTenListItem 으로 전달되고, 또 하위 컴포넌트로 전달됨... 

  // 보여줄 데이터 상태
  const [dataToDisplay, setDataToDisplay] = useState<Omit<RankingDataType, 'totalDataCount'>>({
    rankingData: [],
    weeklyTrends: {},
  });

  const loadInitialData = useCallback((selectedTabIndex: number) => {
    refetch({
      params: {
        column: columns[selectedTabIndex].name,
        skip: 0,
      },
    }).then((res) => {
      setDataToDisplay(res.data);
    }).catch((e) => {
      console.error(e);
    });
  }, [refetch]);

  const onChange = useCallback((event: React.ChangeEvent<unknown>, index: number) => {
    setTabIndex(index);

    if (columns[index]) {
      setCurrentTab(columns[index].name);
      loadInitialData(index);
    } else {
      // 시청자수 순위 버튼 누른 경우
    }
  }, [loadInitialData]);

  const loadMoreData = useCallback(() => {
    refetch({
      params: {
        column: columns[tabIndex].name,
        skip: dataToDisplay.rankingData.length,
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
  }, [dataToDisplay.rankingData.length, refetch, tabIndex]);

  useEffect(() => {
    // mui-tabs기본스타일 덮어쓰기위해 인라인스타일 적용
    if (tabRef.current && tabRef.current.querySelector('.MuiTabs-scroller')) {
      tabRef.current.querySelector('.MuiTabs-scroller').setAttribute('style', 'overflow: visible;');
    }
    // 초기 데이터 불러옴
    loadInitialData(tabIndex);
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
            classes={tabsStyles}
            orientation="vertical"
            value={tabIndex}
            onChange={onChange}
            // variant="fullWidth"
            ref={tabRef}
          >
            {columns.map((c) => (
              <Tab
                disableRipple
                classes={mainTabItemStyles}
                key={c.name}
                icon={c.icon}
                label={c.label}
              />
            ))}
            <Tab
              disableRipple
              classes={viewerTabButtonStyles}
              label="시청자수 순위"
            />
          </Tabs>
        </Grid>
        <Grid item xs={10}>
          <TopTenListContainer
            data={dataToDisplay}
            currentTab={currentTab}
            loading={loading}
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
