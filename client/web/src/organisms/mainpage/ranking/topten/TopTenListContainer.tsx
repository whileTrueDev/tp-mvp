import { Divider, Typography, Hidden } from '@material-ui/core';
import React, { useRef } from 'react';
import { Scores, RankingDataType } from '@truepoint/shared/dist/res/RankingsResTypes.interface';

import { AxiosError } from 'axios';
import { useTopTenList } from '../style/TopTenList.style';
import ListItemSkeleton from './ListItemSkeleton';
import TopTenListItem from './TopTenListItem';

export interface TopTenListProps{
  currentTab: 'smile' |'frustrate'|'cuss'|'admire'|'viewer'|'rating', // 'smile'|'frustrate'|'cuss'|'admire',
  data: undefined | RankingDataType,
  loading?: boolean,
  tabChanging?: boolean,
  weeklyGraphLabel?: string
  error?: AxiosError<any> | undefined
}

function TopTenListContainer(props: TopTenListProps): JSX.Element {
  const {
    loading, error, data, currentTab,
    tabChanging = false,
    weeklyGraphLabel = '주간 점수 그래프',
  } = props;
  const classes = useTopTenList();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={classes.topTenListWrapper}>
      {/* 목록 헤더 */}
      <Hidden smDown>
        <div className={classes.header}>
          <div className={classes.header} style={{ width: '70%' }}>
            <Typography className={classes.headerColumn} style={{ width: '30%' }}>순위</Typography>
            <Typography className={classes.headerColumn} style={{ width: '70%' }}>활동명</Typography>
          </div>
          <div className={classes.header} style={{ width: '30%' }}>
            {/* 선택된 탭에 따라 '주간 점수 그래프', '일일 평균 평점 추이', '주간 시청자수 추이' 로 바뀜 */}
            <Typography className={classes.headerColumn}>{weeklyGraphLabel}</Typography>
          </div>
        </div>
        <Divider />
      </Hidden>

      {/* 목록 아이템 컨테이너 */}
      <div className={classes.listItems} ref={containerRef}>
        {!tabChanging && data && data.rankingData.map((d, index: number) => {
          const currentScoreName = ['viewer', 'rating'].includes(currentTab)
            ? currentTab as keyof Scores
            : `${currentTab}Score` as keyof Scores;

          const weeklyTrendsData = data.weeklyTrends[d.creatorId];
          return (
            <TopTenListItem
              key={d.id}
              index={index}
              data={d}
              currentScoreName={currentScoreName}
              weeklyTrendsData={weeklyTrendsData}
            />
          );
        })}
        {(loading || tabChanging) && (Array.from(Array(10).keys())).map((v: number) => (
          <ListItemSkeleton key={v} />
        ))}
        {!loading && !tabChanging && data
        && data.rankingData.length === 0
        && <Typography className={classes.informationText}>데이터가 없습니다.</Typography>}
        {error && <Typography className={classes.informationText}>에러가 발생했습니다.</Typography>}
      </div>
    </div>
  );
}

export default TopTenListContainer;
