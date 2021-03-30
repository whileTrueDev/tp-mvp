import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Grid, Avatar, Typography, Chip,
} from '@material-ui/core';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import StarRating from './StarRating';
import ScoreBar from '../topten/ScoreBar';

const useCreatorInfoCardStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    display: 'flex',
  },
  creatorInfoContainer: {
    width: '50%',
    marginRight: theme.spacing(1),
  },
  creatorScoresContainer: {
    width: '45%',
  },
}));

export interface CreatorInfoCardProps {
  creatorData: {
    nickname: string,
    platform: 'afreeca'|'twitch',
    creatorId: string,
    twitchChannelName: string | null
  }
}

const scores = [
  { name: 'admire', label: '감탄점수', icon: <SentimentVerySatisfiedIcon /> },
  { name: 'smile', label: '웃음점수', icon: <SentimentSatisfiedAltIcon /> },
  { name: 'frustrate', label: '답답함점수', icon: <SentimentDissatisfiedIcon /> },
  { name: 'cuss', label: '욕점수', icon: <SentimentVeryDissatisfiedIcon /> },
];

export default function CreatorInfoCard({ creatorData }: CreatorInfoCardProps): JSX.Element {
  const {
    nickname, platform, creatorId, twitchChannelName,
  } = creatorData;
  const classes = useCreatorInfoCardStyles();
  return (
    <div className={classes.container}>
      <Grid container className={classes.creatorInfoContainer}>
        <Grid item xs={3}>
          <Avatar />
        </Grid>
        <Grid item xs={9}>
          <div className={classes.container}>
            <Typography>{nickname}</Typography>
            <Chip
              component="a"
              target="_blank"
              rel="noopener"
              size="small"
              clickable
              href={platform === 'afreeca'
                ? `https://bj.afreecatv.com/${creatorId}`
                : `https://www.twitch.tv/${twitchChannelName}`}
              label="방송 보러 가기"
            />
          </div>
          <Typography>평점</Typography>
          <StarRating score={4} />
        </Grid>
      </Grid>

      <div className={classes.creatorScoresContainer}>
        {scores.map((score) => (
          <Grid container>
            <Grid item xs={4}>
              <Typography>
                {score.icon}
                감탄점수
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <ScoreBar score={3} />
            </Grid>
          </Grid>
        ))}
      </div>
    </div>
  );
}
