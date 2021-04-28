import { Typography, Avatar, Link } from '@material-ui/core';
import classnames from 'classnames';
import React, { useMemo } from 'react';
import { Scores, TopTenDataItem, WeeklyTrendsItem } from '@truepoint/shared/dist/res/RankingsResTypes.interface';
import { Link as RouterLink } from 'react-router-dom';
import { useTopTenList } from '../style/TopTenList.style';

import InfoComponent from './InfoComponent';
import TrendsBarChart from './TrendsBarChart';
import '@fortawesome/fontawesome-free/css/all.css';
/**
 * '80%' -> 80으로 반환하는 함수
 * @param strPercentNum '80%' 처럼 %가 포함된 문자열
 * @returns 숫자
 */
function getPercentNumber(strPercentNum: string): number {
  return Number(strPercentNum.replace('%', ''));
}

/**
 * 80 -> '80%' 으로 변환하는 함수
 * @param num 
 * @returns 
 */
function toPercentString(num: number): string {
  return `${num}%`;
}
interface Props{
  index: number;
  data: TopTenDataItem
  headerColumns: {width: string}[],
  currentScoreName: keyof Scores,
  weeklyTrendsData: WeeklyTrendsItem[]
}
function TopTenListItem(props: Props): JSX.Element {
  const classes = useTopTenList();
  const {
    data: d, index, headerColumns, currentScoreName, weeklyTrendsData,
  } = props;
  const { platform, creatorId } = d;

  // 주간점수그래프 부분 제외한 너비
  const backgroundWidth = useMemo(() => 100 - getPercentNumber(headerColumns[3].width), [headerColumns]);
  // 배경색으로 묶이는 칸의 너비 array
  const innerBackgroundWidths = useMemo(() => (
    headerColumns
      .slice(0, headerColumns.length - 1)
      .map((col, idx: number) => (
        100 * (getPercentNumber(headerColumns[idx].width) / backgroundWidth)))
  ), [headerColumns, backgroundWidth]);

  return (
    <div className={classes.listItem}>

      <div
        className={classnames(platform, classes.background)}
        style={{ width: toPercentString(backgroundWidth) }}
      >
        <div
          className={classnames(classes.orderContainer, classes.center)}
          style={{ width: toPercentString(innerBackgroundWidths[0]) }}
        >
          {index < 3
            ? <i className="fas fa-star" />
            : null}
          <Typography>{index + 1}</Typography>
          <img
            className={classnames(classes.platformLogo, { twitch: platform === 'twitch' }, { afreeca: platform === 'afreeca' })}
            src={`/images/logo/${platform === 'twitch' ? 'twitchLogo_no_bg' : 'afreecaLogo'}.png`}
            alt={`${platform}로고`}
          />
        </div>

        <div
          className={classnames(classes.avatarContainer, classes.center)}
          style={{ width: toPercentString(innerBackgroundWidths[1]) }}
        >
          <Link component={RouterLink} to={`/ranking/${platform}/${creatorId}`}>
            <Avatar
              alt={d.creatorName}
              className={classes.avatarImage}
              src={d.afreecaProfileImage || d.twitchProfileImage || undefined}
            />
          </Link>

        </div>

        <div
          className={classnames(classes.infoContainer, classes.center)}
          style={{ width: toPercentString(innerBackgroundWidths[2]) }}
        >
          <InfoComponent data={d} currentScoreName={currentScoreName} />
        </div>

      </div>

      <div
        className={classnames(classes.trendsBarContainer, classes.center)}
        style={{ width: headerColumns[3].width }}
      >
        <TrendsBarChart data={weeklyTrendsData} currentScoreName={currentScoreName} />
      </div>
    </div>
  );
}

export default TopTenListItem;
