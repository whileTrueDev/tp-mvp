import { Divider, Typography } from '@material-ui/core';
import React from 'react';
import { useTopTenList } from '../style/TopTenList.style';
import { Scores, TopTenListProps } from '../types/ToptenCard.types';
import ListItemSkeleton from './ListItemSkeleton';
import TopTenListItem from './TopTenListItem';

const headerColumns = [
  {
    key: 'order', label: '순위', width: '5%', textAlign: 'center',
  },
  { key: 'profileImage', label: '', width: '15%' },
  { key: 'bjName', label: 'BJ이름', width: '45%' },
  { key: 'weeklyScoreGraph', label: '주간 점수 그래프', width: '35%' },
];

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
