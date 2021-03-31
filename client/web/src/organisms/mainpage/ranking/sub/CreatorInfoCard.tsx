import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Grid, Avatar, Typography, Chip,
} from '@material-ui/core';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import StarIcon from '@material-ui/icons/Star';
import classnames from 'classnames';
import StarRating from './StarRating';
import ScoreBar from '../topten/ScoreBar';
import axios from '../../../../utils/axios';

const useCreatorInfoCardStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    display: 'flex',
  },
  creatorInfoContainer: {
    width: '55%',
    marginRight: theme.spacing(3),
  },
  creatorScoresContainer: {
    width: '40%',
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  nameContainer: {
    justifyContent: 'space-between',
  },
}));

export interface CreatorInfoCardProps {
  platform: 'afreeca'|'twitch',
  creatorId: string,
  twitchChannelName: string | null,
  nickname: string,
  averageRating: number,
  ratingCount: number,
  afreecaProfileImage: null | string,
  twitchProfileImage: null | string,
  scores: {
    admire: number,
    smile: number,
    frustrate: number,
    cuss: number
  },
  userRating: null | number
}

type columns = 'admire' | 'smile'|'frustrate'|'cuss';

const scores: {name: columns, label: string, icon?: any}[] = [
  { name: 'admire', label: '감탄점수', icon: <SentimentVerySatisfiedIcon /> },
  { name: 'smile', label: '웃음점수', icon: <SentimentSatisfiedAltIcon /> },
  { name: 'frustrate', label: '답답함점수', icon: <SentimentDissatisfiedIcon /> },
  { name: 'cuss', label: '욕점수', icon: <SentimentVeryDissatisfiedIcon /> },
];

export default function CreatorInfoCard(props: CreatorInfoCardProps): JSX.Element {
  const {
    nickname, platform, creatorId, twitchChannelName,
    averageRating, ratingCount, scores: creatorScores,
    afreecaProfileImage, twitchProfileImage,
    userRating,
  } = props;
  const classes = useCreatorInfoCardStyles();

  const profileImage = platform === 'twitch'
    ? twitchProfileImage
    : afreecaProfileImage;

  const createOrUpdateRatingHandler = (score: number|null) => {
    if (!score) {
      alert('평점을 매겨주세요');
    } else {
      axios.post(`ratings/${creatorId}`, { rating: score })
        .catch((error) => console.error(error, error.response));
    }
  };
  const cancelRatingHandler = () => {
    axios.delete(`ratings/${creatorId}`)
      .catch((error) => console.error(error, error.response));
  };
  return (
    <div className={classes.container}>
      <Grid container className={classes.creatorInfoContainer}>
        <Grid className={classes.avatarContainer} item xs={3}>
          <Avatar className={classes.avatar} src={profileImage as string} />
        </Grid>
        <Grid item xs={9} className={classes.textContainer}>
          <div className={classnames(classes.container, classes.nameContainer)}>
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
          <Typography>
            평균
            <StarIcon />
            {averageRating}
            {`(${ratingCount}명)`}
          </Typography>
          <StarRating
            editRatingHandler={createOrUpdateRatingHandler}
            createRatingHandler={createOrUpdateRatingHandler}
            cancelRatingHandler={cancelRatingHandler}
            score={userRating}
          />
        </Grid>
      </Grid>

      <div className={classes.creatorScoresContainer}>
        {scores.map((score) => (
          <Grid container key={score.name}>
            <Grid item xs={5}>
              <Typography>
                {score.icon}
                {score.label}
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <ScoreBar score={creatorScores[score.name]} />
            </Grid>
          </Grid>
        ))}
      </div>
    </div>
  );
}
