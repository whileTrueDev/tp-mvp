import { Typography, Chip } from '@material-ui/core';
import React from 'react';
import { Scores, TopTenDataItem } from '@truepoint/shared/dist/res/RankingsResTypes.interface';
import ScoreBar from './ScoreBar';
import { useTopTenList } from '../style/TopTenList.style';

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
        <Typography className={classes.creatorName}>{d.creatorName}</Typography>
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

      <div className="scoreBarContainer">
        <ScoreBar score={d[currentScoreName] as number} />
        <Typography
          className={classes.scoreText}
          style={{
            transform: `translateX(${(10 - (d[currentScoreName] || 0)) * (-10)}%`,
          }}
        >
          {`${d[currentScoreName]}`}
        </Typography>
      </div>
    </div>
  );
}

export default InfoComponent;
