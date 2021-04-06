import {
  Chip, Typography, Link,
} from '@material-ui/core';
import { Scores, TopTenDataItem } from '@truepoint/shared/dist/res/RankingsResTypes.interface';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
      <div className={classes.nameContainer}>

        <Link component={RouterLink} to={`/ranking/${d.platform}/${d.creatorId}`}>
          <Typography
            className={classes.creatorName}
          >
            {d.creatorName}
          </Typography>
        </Link>
        <Chip
          className={classes.chip}
          component="a"
          target="_blank"
          rel="noopener"
          avatar={(
            <img
              src={`/images/logo/${d.platform}Logo.png`}
              className={classes.platformLogoImage}
              alt={`${d.platform}로고`}
            />
          )}
          size="small"
          clickable
          href={d.platform === 'afreeca'
            ? `https://bj.afreecatv.com/${d.creatorId}`
            : `https://www.twitch.tv/${d.twitchChannelName}`}
          label="방송 보러 가기"
        />
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
