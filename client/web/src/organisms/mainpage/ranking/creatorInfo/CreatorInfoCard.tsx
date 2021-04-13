import React, { useCallback } from 'react';
import {
  Grid, Avatar, Typography, Chip,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { CreatorRatingInfoRes } from '@truepoint/shared/dist/res/CreatorRatingResType.interface';
import AdmireIcon from '../../../../atoms/svgIcons/AdmireIcon';
import CussIcon from '../../../../atoms/svgIcons/CussIcon';
import FrustratedIcon from '../../../../atoms/svgIcons/FrustratedIcon';
import SmileIcon from '../../../../atoms/svgIcons/SmileIcon';
import StarRating from './StarRating';
import ScoreBar from '../topten/ScoreBar';
import axios from '../../../../utils/axios';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';
import { useCreatorInfoCardStyles } from '../style/CreatorInfoCard.style';

export interface CreatorInfoCardProps extends CreatorRatingInfoRes{
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
 * 방송인정보페이지 상단 방송인 정보와 별점 평가하는 컴포넌트
 * @param props 
 * @returns 
 */
export default function CreatorInfoCard(props: CreatorInfoCardProps): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const {
    info, ratings, scores, userRating, updateAverageRating,
  } = props;
  const {
    platform, creatorId, logo, nickname, twitchChannelName,
  } = info;
  const { average: averageRating, count: ratingCount } = ratings;
  const classes = useCreatorInfoCardStyles();

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
      axios.post(`ratings/${creatorId}`, { rating: score })
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
  }, [creatorId, enqueueSnackbar, updateAverageRating]);

  /**
   * 평점 매긴거 취소하는 핸들러
   * @param cb 버튼 눌렀을 때 loading 상태 제어할 콜백함수, () => setLoading(false)와 같은 함수가 들어올 예정
   */
  const cancelRatingHandler = useCallback((cb?: () => void) => {
    axios.delete(`ratings/${creatorId}`)
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
  }, [creatorId, updateAverageRating]);
  return (
    <Grid container className={classes.creatorInfoContainer}>
      {/* 왼쪽 크리에이터 기본설명, 평점 */}
      <Grid container item className={classes.left} xs={6}>
        <Grid item className={classes.avatarContainer} xs={4}>
          <Avatar className={classes.avatar} src={logo} />
        </Grid>

        <Grid item className={classes.textContainer} xs={8}>
          <div className="top">
            <Typography className={classes.nickname}>
              {nickname}
            </Typography>
            <div className={classes.ratingContainer}>
              <Typography className={classes.averageRatingText}>
                평균★
                {averageRating}
                {`(${ratingCount}명)`}
              </Typography>
              <StarRating
                createRatingHandler={createRatingHandler}
                cancelRatingHandler={cancelRatingHandler}
                score={userRating || undefined}
                ratingProps={{ size: 'large' }}
              />
            </div>
          </div>
          <div className={classes.creatorDescription}>testtext</div>

        </Grid>

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

      {/* 오른쪽 크리에이터 점수 */}
      <Grid item className={classes.right} xs={6}>
        {scoreLables.map((score) => (
          <Grid container key={score.name}>
            <Grid item xs={2}>
              <Typography>
                {score.icon}
                {score.label}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <ScoreBar score={scores[score.name]} />
            </Grid>
          </Grid>
        ))}
      </Grid>

    </Grid>
  );
}
