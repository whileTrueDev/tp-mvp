import { Typography, Avatar } from '@material-ui/core';
import classnames from 'classnames';
import React from 'react';
import { Scores, TopTenDataItem, WeeklyTrendsItem } from '@truepoint/shared/dist/res/RankingsResTypes.interface';
import { useTopTenList } from '../style/TopTenList.style';
import InfoComponent from './InfoComponent';
import TrendsBarChart from './TrendsBarChart';

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
  return (
    <div className={classes.listItem}>

      <div
        className={classnames(classes.orderContainer, classes.center)}
        style={{ width: headerColumns[0].width }}
      >
        {index < 3
          ? <i className="fas fa-star" />
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
        <TrendsBarChart data={weeklyTrendsData} currentScoreName={currentScoreName} />
      </div>
    </div>
  );
}

export default TopTenListItem;
