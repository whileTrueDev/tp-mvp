import React, { useMemo, useRef } from 'react';

import {
  Avatar, Chip, Divider, LinearProgress, Typography,
} from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import classnames from 'classnames';
import {
  TopTenListProps, Scores,
} from '../types/ToptenCard.types';
import { useTopTenList, useProgressBar } from '../style/TopTenList.style';

const headerColumns = [
  {
    key: 'order', label: '순위', width: '5%', textAlign: 'center',
  },
  { key: 'profileImage', label: '', width: '15%' },
  { key: 'bjName', label: 'BJ이름', width: '45%' },
  { key: 'weeklyScoreGraph', label: '주간 점수 그래프', width: '35%' },
];

const MIN = 0;
const MAX = 10;
const normalize = (value: number): number => ((value - MIN) * 100) / (MAX - MIN);
function TopTenList(props: TopTenListProps): JSX.Element {
  const classes = useTopTenList();
  const progressBarStyles = useProgressBar();
  const { data, currentTab } = props;
  const currentScoreName = useMemo(() => (`${currentTab}Score` as keyof Scores), [currentTab]);
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
        {data?.rankingData.map((d, index:number) => {
          return (
            // 목록 아이템 (row) 컴포넌트
            <div key={d.id} className={classes.listItem}>
              {/* 번호 cell */}
              <div
                className={classnames(classes.orderContainer, classes.center)}
                style={{width: headerColumns[0].width}}>
                {index < 3 ? <StarIcon className={classes.star}/> : null}
                <Typography>{index+1}</Typography>
              </div>
              {/* 아바타 cell */}
              <div
                className={classnames(classes.avatarContainer, classes.center)}
                style={{width: headerColumns[1].width}}>
                <Avatar alt={d.creatorName} className={classes.avatarImage}/>
              </div>
              {/* bj이름 cell, 방송제목, 점수 포함 */}
              <div
                className={classnames(classes.infoContainer, classes.center)}
                style={{width: headerColumns[2].width}}>
                  <div className={classes.infoWrapper}>
                  <div className={classes.nameContainer}>
                    <Typography className={classes.creatorName}>{d.creatorName}</Typography>
                    <Chip
                      className={classes.chip}
                      component="a"
                      target="_blank"
                      rel="noopener"
                      avatar={<img src={`/images/logo/${d.platform}Logo.png`} className={classes.platformLogoImage}/>}
                      size="small"
                      clickable
                      href={d.platform === 'afreeca'
                      ? `https://bj.afreecatv.com/${d.creatorId}`
                      : `https://www.twitch.tv/${d.creatorId}`}
                      label="방송 보러 가기"/>
                  </div>
                  <Typography className={classes.title}>{d.title}</Typography>

                  <div className={classes.progressContainer}>
                    <LinearProgress
                    variant="determinate"
                    aria-valuemin={0}
                    aria-valuemax={10}
                    aria-valuenow={d[currentScoreName]}
                    valueBuffer={10}
                    classes={progressBarStyles}
                    value={normalize(d[currentScoreName] as number)} />
                    <Typography
                      className={classes.scoreText}
                      style={{
                        transform: `translateX(${(10 - (d[currentScoreName]||0)) * (-10)}%`
                        }}>
                      {`${d[currentScoreName]}`}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>);
        })}
      </div>

      {/* {JSON.stringify(data, null, 2)} */}
    </div>
  );
}

export default TopTenList;
