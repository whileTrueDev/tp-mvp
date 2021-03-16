import React, { useMemo } from 'react';
import {
  Avatar, Chip, Divider, Typography,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import StarIcon from '@material-ui/icons/Star';
import classnames from 'classnames';
import { Skeleton } from '@material-ui/lab';
import {
  TopTenListProps, Scores,
} from '../types/ToptenCard.types';
import { useTopTenList } from '../style/TopTenList.style';
import ScoreBar from './ScoreBar';

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
  const { data, currentTab, loading } = props;
  const theme = useTheme();
  const currentScoreName = useMemo(() => (`${currentTab}Score` as keyof Scores), [currentTab]);
  const rectSkeleton = useMemo(() => (<Skeleton variant="rect" width="100%" height={theme.spacing(4)} />), []);
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
                {loading
                ? <Skeleton variant="circle" width={theme.spacing(10)} height={theme.spacing(10)}/>
                : <Avatar alt={d.creatorName} className={classes.avatarImage} src={d.afreecaProfileImage || d.twitchProfileImage || undefined}/>
               }

            </div>
            {/* bj이름 cell */}
            <div
              className={classnames(classes.infoContainer, classes.center)}
              style={{width: headerColumns[2].width}}>
              {/* center 정렬위한 wrapper컴포넌트 */}
              <div className={classes.infoWrapper}>
                {/* bj이름, 방송국 링크 컴포넌트 */}
                <div className={classes.nameContainer}>
                  {loading
                  ? rectSkeleton
                  :<>
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
                        : `https://www.twitch.tv/${d.twitchChannelName}`}
                        label="방송 보러 가기"/>
                    </>
                  }
                </div>
                {/* 최근방송제목 컴포넌트 */}
                <Typography className={classes.title}>
                  {loading ? rectSkeleton
                           : d.title}
                </Typography>

                {/* 탭 점수 컴포넌트 */}
                { loading
                ? rectSkeleton
                :<div className="scoreBarContainer">
                  <ScoreBar score={d[currentScoreName] as number}/>
                  <Typography
                    className={classes.scoreText}
                    style={{
                      transform: `translateX(${(10 - (d[currentScoreName]||0)) * (-10)}%`
                      }}>
                    {`${d[currentScoreName]}`}
                  </Typography>
                </div>
                }

              </div>
            </div>

          </div>);
        })}
      </div>
    </div>
  );
}

export default TopTenList;
