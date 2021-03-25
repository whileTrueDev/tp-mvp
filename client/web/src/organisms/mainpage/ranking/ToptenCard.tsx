import {
  Grid, Tab, Tabs, Typography,
} from '@material-ui/core';
import React, { useState, useRef, useEffect } from 'react';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import useAxios from 'axios-hooks';
import dayjs from 'dayjs';
import { RankingDataType } from '@truepoint/shared/dist/res/RankingsResTypes.interface';
import { useTopTenCard, useTabs, useTabItem } from './style/TopTenCard.style';
import TopTenListContainer from './topten/TopTenListContainer';

const columns = [
  { name: 'admire', label: '감탄점수', icon: <SentimentVerySatisfiedIcon/> },
  { name: 'smile', label: '웃음점수', icon: <SentimentSatisfiedAltIcon /> },
  { name: 'frustrate', label: '답답함점수', icon: <SentimentDissatisfiedIcon /> },
  { name: 'cuss', label: '욕점수', icon: <SentimentVeryDissatisfiedIcon /> },
];
function TopTenCard(): JSX.Element {
  const classes = useTopTenCard();
  const [tabIndex, setTabIndex] = useState(0);
  const tabRef = useRef<any>(null);
  const tabsStyles = useTabs();
  const tabItemStyles = useTabItem();

  // 탭 별 상위 10인 요청
  const [{ data, loading, error }, refetch] = useAxios<RankingDataType>({
    url: '/rankings/top-ten',
    params: { column: columns[0].name },
  });
  // 최근 분석날짜 요청
  const [{ data: recentAnalysisDate },
  ] = useAxios<Date>('/rankings/recent-analysis-date');

  const onChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setTabIndex(value);
    refetch({ params: { column: columns[value].name } });
  };

  // mui-tabs기본스타일 덮어쓰기위해 인라인스타일 적용
  useEffect(() => {
    if (tabRef.current){
      tabRef.current.querySelector('.MuiTabs-scroller')?.setAttribute('style','overflow: visible;');
    }
  },[])

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
            style={{overflow: 'visible'}} // mui-tabs기본스타일 덮어쓰기위해 인라인스타일 적용
            classes={tabsStyles}
            orientation="vertical"
            value={tabIndex}
            onChange={onChange}
            variant="fullWidth"
            ref={tabRef}
          >
            {columns.map((c: typeof columns[0]) => (
              <Tab
                disableRipple
                classes={tabItemStyles}
                key={c.name}
                icon={c.icon}
                label={c.label}
              />
            ))}
          </Tabs>
        </Grid>
        <Grid item xs={10}>
          <TopTenListContainer
            data={data}
            currentTab={columns[tabIndex].name}
            loading={loading}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default TopTenCard;
