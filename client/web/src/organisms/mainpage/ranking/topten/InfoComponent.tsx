import { Typography, Link } from '@material-ui/core';
import { Scores, TopTenDataItem } from '@truepoint/shared/dist/res/RankingsResTypes.interface';
import classnames from 'classnames';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import StarRating from '../creatorInfo/StarRating';
import { useTopTenList } from '../style/TopTenList.style';
import ScoreBar from './ScoreBar';

export function ViewerCountDisplay(props: {viewer: number}): JSX.Element {
  const { viewer } = props;
  return (
    <div>
      <Typography component="span" style={{ fontSize: '12px' }}>최고 시청자수 : </Typography>
      <Typography component="span" style={{ fontSize: '18px', fontWeight: 'bold' }}>{`${viewer} 명`}</Typography>
    </div>
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
        <Link className={classes.nameLink} component={RouterLink} to={`/ranking/creator/${d.creatorId}`}>
          <Typography noWrap className={classes.creatorName}>
            {d.creatorName}
          </Typography>
        </Link>
        <div className={classnames(classes.ratingContainer, { column: currentScoreName === 'rating' })}>
          <StarRating
            ratingProps={{
              size: currentScoreName === 'rating' ? 'large' : 'small',
            }}
            score={d.averageRating}
            readOnly
          />
          <Typography noWrap className="scoreText">{`평점 ${d.averageRating ? d.averageRating.toFixed(2) : 0}`}</Typography>
        </div>
      </div>

      {currentScoreName !== 'viewer' && (
        <Typography className={classes.title}>
          {d.title}
        </Typography>
      )}

      {currentScoreName === 'viewer' && <ViewerCountDisplay viewer={d[currentScoreName] || 0} />}
      {!['viewer', 'rating'].includes(currentScoreName) && <ScoreBar score={d[currentScoreName] || 0} />}

    </div>
  );
}

export default InfoComponent;
