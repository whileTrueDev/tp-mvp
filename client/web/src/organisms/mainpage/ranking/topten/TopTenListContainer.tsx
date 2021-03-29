import { Button, Divider, Typography } from '@material-ui/core';
import React, { useMemo, useRef } from 'react';
import { Scores, RankingDataType } from '@truepoint/shared/dist/res/RankingsResTypes.interface';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
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
  currentTab: string, // 'smile'|'frustrate'|'cuss'|'admire',
  data: undefined | Omit<RankingDataType, 'totalDataCount'>,
  loading?: boolean,
  weeklyGraphLabel?: string
}

function TopTenListContainer(props: TopTenListProps): JSX.Element {
  const {
    loading, data, currentTab, weeklyGraphLabel = '주간 점수 그래프',
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

  const scrollToContainerTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView();
    }
  };

  return (
    <div className={classes.topTenListWrapper}>
      {/* 목록 헤더 */}
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

      {/* 목록 아이템 컨테이너 */}
      <div className={classes.listItems} ref={containerRef}>
        {loading || !data
          ? (Array.from(Array(10).keys())).map((v: number) => (
            <ListItemSkeleton key={v} headerColumns={headerColumns} />
          ))
          : data.rankingData.map((d, index: number) => {
            const currentScoreName = currentTab === 'viewer' ? currentTab : `${currentTab}Score` as keyof Scores;
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
      </div>

      {/* 위로 버튼 */}
      <Button className={classes.scrollTopButton} onClick={scrollToContainerTop}>
        <ArrowUpwardIcon />
        {' '}
        위로 이동
      </Button>
    </div>
  );
}

export default TopTenListContainer;
