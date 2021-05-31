import { Divider, Typography, Hidden } from '@material-ui/core';
import React, { useMemo, useRef } from 'react';
import { Scores, RankingDataType } from '@truepoint/shared/dist/res/RankingsResTypes.interface';

import { AxiosError } from 'axios';
import { useTopTenList } from '../style/TopTenList.style';
import ListItemSkeleton from './ListItemSkeleton';
import TopTenListItem from './TopTenListItem';

type HeaderColumn = {
  key: string,
  label: string,
  width: string,
  textAlign?: string
}
export interface TopTenListProps{
  currentTab: 'smile' |'frustrate'|'cuss'|'admire'|'viewer'|'rating', // 'smile'|'frustrate'|'cuss'|'admire',
  data: undefined | RankingDataType,
  loading?: boolean,
  tabChanging? : boolean,
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

  const headerColumns: HeaderColumn[] = useMemo(() => (
    [
      {
        key: 'order', label: '순위', width: '5%', textAlign: 'center',
      },
      { key: 'profileImage', label: '', width: '15%' },
      { key: 'bjName', label: 'BJ이름', width: '50%' },
      { key: 'weeklyScoreGraph', label: weeklyGraphLabel, width: '30%' },
    ]
  ), [weeklyGraphLabel]);

  return (
    <div className={classes.topTenListWrapper}>
      {/* 목록 헤더 */}
      <Hidden smDown>
        <div className={classes.header}>
          {headerColumns.map((column) => (
            <div
              key={column.key}
              className={classes.headerColumn}
              style={{ width: column.width || 'auto' }}
            >
              <Typography>{column.label}</Typography>
            </div>
          ))}
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
              headerColumns={headerColumns}
              currentScoreName={currentScoreName}
              weeklyTrendsData={weeklyTrendsData}
            />
          );
        })}
        {(loading || tabChanging) && (Array.from(Array(10).keys())).map((v: number) => (
          <ListItemSkeleton key={v} headerColumns={headerColumns} />
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
