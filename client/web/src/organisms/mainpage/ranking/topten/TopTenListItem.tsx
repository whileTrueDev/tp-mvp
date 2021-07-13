import {
  Typography, Avatar, Link, Hidden,
} from '@material-ui/core';
import classnames from 'classnames';
import React from 'react';
import { Scores, TopTenDataItem, WeeklyTrendsItem } from '@truepoint/shared/dist/res/RankingsResTypes.interface';
import { Link as RouterLink } from 'react-router-dom';
import { useTopTenList } from '../style/TopTenList.style';

import InfoComponent from './InfoComponent';
import TrendsBarChart from './TrendsBarChart';
import useMediaSize from '../../../../utils/hooks/useMediaSize';

export interface TopTenListItemProps{
  index: number;
  data: TopTenDataItem
  currentScoreName: keyof Scores,
  weeklyTrendsData: WeeklyTrendsItem[]
}
export default function TopTenListItem(props: TopTenListItemProps): JSX.Element {
  const classes = useTopTenList();
  const {
    data: d, index, currentScoreName, weeklyTrendsData,
  } = props;
  const { platform, creatorId } = d;
  const { isMobile } = useMediaSize();

  return (
    <div className={classes.listItem}>

      <div
        className={classnames(platform, classes.background)}
        style={{ width: isMobile ? '100%' : '70%' }}
      >
        {/* 순위 칸 */}
        <div
          className={classnames(classes.orderContainer, classes.center)}
          style={{ width: '10%' }}
        >
          {index === 0 && <img src="images/rankingPage/star_icon_gold.png" alt="1위" />}
          {index === 1 && <img src="images/rankingPage/star_icon_silver.png" alt="2위" />}
          {index === 2 && <img src="images/rankingPage/star_icon_bronze.png" alt="3위" />}
          <Typography>{index + 1}</Typography>
          <img
            className={classnames(classes.platformLogo, { twitch: platform === 'twitch' }, { afreeca: platform === 'afreeca' })}
            src={`/images/logo/${platform === 'twitch' ? 'twitchLogo_no_bg' : 'afreecaLogo'}.png`}
            alt={`${platform}로고`}
          />
        </div>

        {/* 프로필 이미지 칸 */}
        <div
          className={classnames(classes.avatarContainer, classes.center)}
          style={{ width: '20%' }}
        >
          <Link component={RouterLink} to={`/ranking/creator/${creatorId}`}>
            <Avatar
              alt={d.creatorName}
              className={classes.avatarImage}
              src={d.afreecaProfileImage || d.twitchProfileImage || undefined}
            />
          </Link>
        </div>

        {/* 활동명 + 기타 정보 칸 */}
        <div
          className={classnames(classes.infoContainer, classes.center)}
          style={{ width: '70%' }}
        >
          <InfoComponent data={d} currentScoreName={currentScoreName} />
        </div>
      </div>

      {/* 주간점수그래프 칸 */}
      <Hidden smDown>
        <div
          className={classnames(classes.trendsBarContainer, classes.center)}
          style={{ width: '30%' }}
        >
          <TrendsBarChart data={weeklyTrendsData} currentScoreName={currentScoreName} />
        </div>
      </Hidden>
    </div>
  );
}
