/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  Avatar, Divider, Typography,
} from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import classnames from 'classnames';
import {
  TopTenListProps, Scores,
} from '../types/ToptenCard.types';
import { useTopTenList } from '../style/TopTenList.style';
import TrendsBarChart from './TrendsBarChart';
import InfoComponent from './InfoComponent';
import ListItemSkeleton from './ListItemSkeleton';

const headerColumns = [
  {
    key: 'order', label: '순위', width: '5%', textAlign: 'center',
  },
  { key: 'profileImage', label: '', width: '15%' },
  { key: 'bjName', label: 'BJ이름', width: '45%' },
  { key: 'weeklyScoreGraph', label: '주간 점수 그래프', width: '35%' },
];

function TopTenList(props: TopTenListProps): JSX.Element {
  const classes = useTopTenList();
  const { data, loading } = props;

  return (
    <div className={classes.wrapper}>
      {/* 목록 헤더 row */}
      <div className={classes.header}>
        {headerColumns.map((column) => (
          <React.Fragment key={column.key}>
            <div
              style={{ width: column.width || 'auto' }}
              className={classes.headerColumn}
            >
              <Typography>{column.label}</Typography>
            </div>
          </React.Fragment>
        ))}
      </div>
      <Divider />

      {/* 목록 아이템 컨테이너 */}
      <div className={classes.listItems}>
        {loading
          ? (Array.from(Array(10).keys()).map((v: number) => (
            <React.Fragment key={v}>
              <ListItemSkeleton headerColumns={headerColumns} />
            </React.Fragment>
          )))
          : (data?.rankingData.map((d, index: number) => {
            const currentScoreName = `${props.currentTab}Score` as keyof Scores;
            const weeklyData = data?.weeklyTrends[d.creatorId];
            return (
              // 목록 아이템 (row) 컴포넌트
              <div key={d.id} className={classes.listItem}>

              <div
              className={classnames(classes.orderContainer, classes.center)}
              style={{ width: headerColumns[0].width }}
              >
              {index < 3
              ? <StarIcon className={classes.star} />
              : null}
              <Typography>{index + 1}</Typography>
              </div>

              <div
              className={classnames(classes.avatarContainer, classes.center)}
              style={{ width: headerColumns[1].width }}
              >
              <Avatar
              alt={d.creatorName}
              className={classes.avatarImage}
              src={d.afreecaProfileImage || d.twitchProfileImage || undefined}
              />
              </div>

              <div
              className={classnames(classes.infoContainer, classes.center)}
              style={{ width: headerColumns[2].width }}
              >
              <InfoComponent data={d} currentScoreName={currentScoreName} />
              </div>

              <div
              className={classnames(classes.trendsBarContainer, classes.center)}
              style={{ width: headerColumns[3].width }}
              >
              <TrendsBarChart data={weeklyData} currentScoreName={currentScoreName} />
              </div>
              </div>
            );
            })
          )}
      </div>
    </div>
  );
}

export default TopTenList;
