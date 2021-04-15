import { Typography, Link } from '@material-ui/core';
import { Scores, TopTenDataItem } from '@truepoint/shared/dist/res/RankingsResTypes.interface';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import StarRating from '../creatorInfo/StarRating';
import { useTopTenList } from '../style/TopTenList.style';
import ScoreBar from './ScoreBar';

export function ViewerCountDisplay(props: {viewer: number}): JSX.Element {
  const { viewer } = props;
  return (
    <Typography component="span">{`최고 시청자수: ${viewer} 명`}</Typography>
  );
}
export interface InfoComponentProps{
  data: TopTenDataItem,
  currentScoreName: keyof Scores

}
function InfoComponent(props: InfoComponentProps): JSX.Element {
  const { data: d, currentScoreName } = props;
  const classes = useTopTenList();
  return (
    <div className={classes.infoWrapper}>
      <div className={classes.infoHeader}>
        <Link className={classes.nameLink} component={RouterLink} to={`/ranking/${d.platform}/${d.creatorId}`}>
          <Typography noWrap className={classes.creatorName}>
            {d.creatorName}
          </Typography>
        </Link>
        <div className={classes.ratingContainer}>
          <StarRating score={d.averageRating} readOnly />
          <Typography noWrap>{`주간 평점 ${d.averageRating ? d.averageRating.toFixed(2) : 0}`}</Typography>
        </div>
      </div>

      <Typography className={classes.title}>
        {d.title}
      </Typography>

      {currentScoreName === 'viewer'
        ? <ViewerCountDisplay viewer={d[currentScoreName] || 0} />
        : (
          <ScoreBar score={d[currentScoreName] || 0} />
        )}

    </div>
  );
}

export default InfoComponent;
