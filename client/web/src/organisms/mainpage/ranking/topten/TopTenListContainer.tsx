import { Divider, Typography } from '@material-ui/core';
import React from 'react';
import { Scores, RankingDataType } from '@truepoint/shared/dist/res/RankingsResTypes.interface';
import { useTopTenList } from '../style/TopTenList.style';
import ListItemSkeleton from './ListItemSkeleton';
import TopTenListItem from './TopTenListItem';

// width 는 반드시 '80%' 와 같이 %기호가 포함된 문자열이어야 함(TopTenListItem내 칸 너비를 %로 지정함)
const headerColumns = [
  {
    key: 'order', label: '순위', width: '5%', textAlign: 'center',
  },
  { key: 'profileImage', label: '', width: '15%' },
  { key: 'bjName', label: 'BJ이름', width: '50%' },
  { key: 'weeklyScoreGraph', label: '주간 점수 그래프', width: '30%' },
];

export interface TopTenListProps{
  currentTab: string, // 'smile'|'frustrate'|'cuss'|'admire',
  data: undefined | RankingDataType,
  loading?: boolean
}

function TopTenListContainer(props: TopTenListProps): JSX.Element {
  const { loading, data, currentTab } = props;
  const classes = useTopTenList();
  return (
    <div className={classes.wrapper}>
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
      <div className={classes.listItems}>
        {loading || !data
          ? (Array.from(Array(10).keys())).map((v: number) => (
            <ListItemSkeleton key={v} headerColumns={headerColumns} />
          ))
          : data.rankingData.map((d, index: number) => {
            const currentScoreName = `${currentTab}Score` as keyof Scores;
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
    </div>
  );
}

export default TopTenListContainer;
