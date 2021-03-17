import React, { useMemo } from 'react';
import {
  Avatar, Divider, Typography,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import StarIcon from '@material-ui/icons/Star';
import classnames from 'classnames';
import { Skeleton } from '@material-ui/lab';
import {
  TopTenListProps, Scores,
} from '../types/ToptenCard.types';
import { useTopTenList } from '../style/TopTenList.style';
import TrendsBarChart from './TrendsBarChart';
import InfoComponent from './InfoComponent';

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
  const { loading } = props;
  const theme = useTheme();

  const placeholderSkeleton = useMemo(() => (
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((v: number, index: number) => (
      <div key={v} className={classnames(classes.listItem, classes.placeholder)}>
        <div style={{ width: headerColumns[0].width }}>
          <Skeleton variant="rect" width="100%" height={theme.spacing(4)} />
        </div>
        <div style={{ width: headerColumns[1].width }}>
          <Skeleton variant="circle" width={theme.spacing(10)} height={theme.spacing(10)} />
        </div>
        <div style={{ width: headerColumns[2].width }}>
          <Skeleton width="90%" height={theme.spacing(4)} />
          <Skeleton width="90%" />
          <Skeleton width="90%" />
        </div>
        <div style={{ width: headerColumns[3].width }}>
          <Skeleton variant="rect" width="90%" height={theme.spacing(10)} />
        </div>
      </div>
    ))
  ), [classes.listItem, classes.placeholder, theme]);

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
        {loading && placeholderSkeleton}
        {!loading && (
          props.data?.rankingData.map((d, index:number) => {
            const currentScoreName = `${props.currentTab}Score` as keyof Scores;
            const weeklyData = props.data?.weeklyTrends[d.creatorId];
            return (
              // 목록 아이템 (row) 컴포넌트
              <div key={d.id} className={classes.listItem}>

              <div
              className={classnames(classes.orderContainer, classes.center)}
              style={{width: headerColumns[0].width}}>
              {index < 3
              ? <StarIcon className={classes.star} />
              : null}
              <Typography>{index+1}</Typography>
              </div>

              <div
              className={classnames(classes.avatarContainer, classes.center)}
              style={{width: headerColumns[1].width}}>
              <Avatar
              alt={d.creatorName}
              className={classes.avatarImage}
              src={d.afreecaProfileImage || d.twitchProfileImage || undefined}/>
              </div>

              <div
              className={classnames(classes.infoContainer, classes.center)}
              style={{width: headerColumns[2].width}}>
              <InfoComponent data={d} currentScoreName={currentScoreName}/>

              </div>

              <div
              className={classnames(classes.trendsBarContainer, classes.center)}
              style={{width: headerColumns[3].width}}>
              <TrendsBarChart data={weeklyData} currentScoreName={currentScoreName}/>
              </div>
              </div>);
            })
        )}

      </div>
    </div>
  );
}

export default TopTenList;
