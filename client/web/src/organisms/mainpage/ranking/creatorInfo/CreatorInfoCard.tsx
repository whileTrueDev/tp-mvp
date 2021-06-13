import React, { useCallback, useEffect, useState } from 'react';
import {
  Avatar, Chip, Grid, Typography,
} from '@material-ui/core';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import {
  CreatorRatingInfoRes, CreatorAverageRatings, CreatorAverageScores,
} from '@truepoint/shared/dist/res/CreatorRatingResType.interface';
import { useSnackbar } from 'notistack';
import { Textfit } from 'react-textfit';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';
import AdmireIcon from '../../../../atoms/svgIcons/AdmireIcon';
import CussIcon from '../../../../atoms/svgIcons/CussIcon';
import FrustratedIcon from '../../../../atoms/svgIcons/FrustratedIcon';
import SmileIcon from '../../../../atoms/svgIcons/SmileIcon';
import axios from '../../../../utils/axios';
import {
  useCreatorInfoCardStyles, useExLargeRatingStyle,
  useProfileSectionStyles, useScoreSectionStyles,
} from '../style/CreatorInfoCard.style';
import ScoreBar from '../topten/ScoreBar';
import StarRating from './StarRating';
import useAuthContext from '../../../../utils/hooks/useAuthContext';

export interface CreatorInfoCardProps extends CreatorRatingInfoRes{
  user?: User;
  updateAverageRating?: () => void
}

type columns = 'admire' | 'smile'|'frustrate'|'cuss';

const scoreLables: {name: columns, label: string, icon?: any}[] = [
  { name: 'admire', label: '감탄점수', icon: <AdmireIcon /> },
  { name: 'smile', label: '웃음점수', icon: <SmileIcon /> },
  { name: 'frustrate', label: '답답함점수', icon: <FrustratedIcon /> },
  { name: 'cuss', label: '욕점수', icon: <CussIcon /> },
];

/**
 * 방송인 프로필 & 평점 매기는 부분 있는 카드
 */
export function ProfileSection({
  user,
  updateAverageRating, ratings,
}: {
  user?: User,
  updateAverageRating?: () => void,
  ratings: CreatorAverageRatings
}): JSX.Element {
  const classes = useProfileSectionStyles();
  const largeRating = useExLargeRatingStyle();
  const authContext = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const platform = user?.afreeca ? 'afreeca' : 'twitch';
  const creatorId = user?.afreeca ? user?.afreeca?.afreecaId : user?.twitch?.twitchId;
  const logo = user?.afreeca ? user?.afreeca?.logo : user?.twitch?.logo;
  const nickname = user?.afreeca ? user?.afreeca?.afreecaStreamerName : user?.twitch?.twitchStreamerName;
  const twitchChannelName = user?.twitch?.twitchChannelName;

  const { average: averageRating, count: ratingCount } = ratings;
  const [userRating, setUserRating] = useState<number|undefined>(); // useAuthContext.user.userId로 매긴 별점// 혹은 userIp로 매겨진 별점 가져오기

  useEffect(() => {
    const params = {
      userId: authContext.user.userId,
    };
    axios.get(`ratings/${creatorId}`, {
      params,
    })
      .then((res) => {
        if (res.data) {
          setUserRating(res.data.score);
        }
      })
      .catch((error) => console.error(error));
  }, [authContext.user.userId, creatorId]);
  /**
   * 평점 생성, 수정 핸들러 함수
   * 평점을 매기고, 평균평점을 새로 불러온다
  //  * @param score 유저가 정한 평점
   * @param cb 버튼 눌렀을 때 loading 상태 제어할 콜백함수, () => setLoading(false)와 같은 함수가 들어올 예정
   */
  const createRatingHandler = useCallback((score: number|null, cb?: () => void) => {
    if (!score) {
      ShowSnack('평점을 매겨주세요', 'error', enqueueSnackbar);
    } else {
      axios.post(`ratings/${creatorId}`, {
        rating: score,
        userId: authContext.user.userId,
        platform,
      })
        .then(() => {
          if (updateAverageRating) {
            updateAverageRating();
          }
          if (cb) {
            cb();
          }
        })
        .catch((error) => {
          console.error(error, error.response);
          if (cb) {
            cb();
          }
        });
    }
  }, [authContext.user.userId, creatorId, enqueueSnackbar, platform, updateAverageRating]);

  /**
   * 평점 매긴거 취소하는 핸들러
   * @param cb 버튼 눌렀을 때 loading 상태 제어할 콜백함수, () => setLoading(false)와 같은 함수가 들어올 예정
   */
  const cancelRatingHandler = useCallback((cb?: () => void) => {
    axios.delete(`ratings/${creatorId}`, {
      data: {
        userId: authContext.user.userId,
      },
    })
      .then(() => {
        if (updateAverageRating) {
          updateAverageRating();
        }
        if (cb) {
          cb();
        }
      })
      .catch((error) => {
        console.error(error, error.response);
        if (cb) {
          cb();
        }
      });
  }, [authContext.user.userId, creatorId, updateAverageRating]);

  return (
    <>
      <Grid item xs={12} className={classes.linkButtons}>
        {user?.detail?.youtubeChannelAddress ? (
          <Chip
            className={classes.chipLink}
            component="a"
            target="_blank"
            rel="noopener"
            size="small"
            clickable
            href={user?.detail?.youtubeChannelAddress}
            label="Youtube 가기"
          />
          ) : (null)}
        <Chip
          className={classes.chipLink}
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
      </Grid>
      <Grid item className={classes.avatarContainer} xs={4}>
        <Avatar className={classes.avatar} src={logo} />
      </Grid>

      <Grid item container className={classes.textContainer} xs={8}>
        <Grid item className={classes.nameContainer}>
          <Typography className={classes.nickname} component="div">
            <Textfit mode="single" max={20}>{nickname}</Textfit>
          </Typography>
        </Grid>
        <Grid item className={classes.ratingContainer}>
          <Typography className={classes.averageRatingText}>
            평균★
            {averageRating.toFixed(2)}
            {`(${ratingCount}명)`}
          </Typography>
          <StarRating
            createRatingHandler={createRatingHandler}
            cancelRatingHandler={cancelRatingHandler}
            score={userRating}
            ratingProps={{
              classes: largeRating,
            }}
          />
        </Grid>
        <Grid item className={classes.descriptionContainer}>
          <Typography component="pre" className={classes.creatorDescription}>
            {user?.detail?.description ? String(user.detail.description) : ''}
          </Typography>
        </Grid>

      </Grid>
    </>
  );
}

/**
 * 감정점수 있는 부분
 */
export function ScoresSection({ scores }: {
  scores: CreatorAverageScores
}): JSX.Element {
  const classes = useScoreSectionStyles();
  return (
    <>
      {scoreLables.map((score) => (
        <Grid container key={score.name} className={classes.scoreItemContainer}>
          <Grid item className={classes.scoreLabelContainer}>
            <Typography className={classes.scoreLabelText}>
              {score.icon}
            </Typography>
            <Typography className={classes.scoreLabelText}>
              {score.label}
            </Typography>
          </Grid>
          <Grid item className={classes.scoreBarContainer}>
            <ScoreBar score={scores[score.name]} />
          </Grid>
        </Grid>
      ))}
    </>
  );
}

/**
 * 방송인정보페이지 상단 방송인 정보와 별점 평가하는 컴포넌트
 * @param props 
 * @returns 
 */
export default function CreatorInfoCard(props: CreatorInfoCardProps): JSX.Element {
  const {
    // info, 
    ratings, scores, updateAverageRating, user,
  } = props;

  const classes = useCreatorInfoCardStyles();

  return (
    <Grid container className={classes.creatorInfoContainer}>
      {/* 왼쪽 크리에이터 기본설명, 평점 */}
      <Grid container item className={classes.left} xs={7}>
        <ProfileSection
          user={user}
          ratings={ratings}
          // info={info}
          updateAverageRating={updateAverageRating}
        />
      </Grid>

      {/* 오른쪽 크리에이터 점수 */}
      <Grid item className={classes.right} xs={5}>
        <ScoresSection scores={scores} />
      </Grid>

    </Grid>
  );
}
