import React, { useCallback } from 'react';
import {
  Avatar, Chip, Grid, Typography,
} from '@material-ui/core';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import { CreatorAverageRatings } from '@truepoint/shared/dist/res/CreatorRatingResType.interface';
import { useSnackbar } from 'notistack';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';
import { useExLargeRatingStyle, useProfileSectionStyles } from '../style/CreatorInfoCard.style';
import StarRating from './StarRating';
import useAuthContext from '../../../../utils/hooks/useAuthContext';
import useUserRating from '../../../../utils/hooks/query/useUserRating';
import useMutateRating from '../../../../utils/hooks/mutation/useMutateRating';
import useRemoveRating from '../../../../utils/hooks/mutation/useRemoveRating';

/**
 * 방송인 프로필 & 평점 매기는 부분 있는 카드
 */
export function ProfileSection({
  userData: user, ratings,
}: {
  userData?: User,
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
  const { data: userRating } = useUserRating({ creatorId: creatorId || '', userId: authContext.user.userId });
  const { mutate: createRating } = useMutateRating();
  const { mutate: removeRating } = useRemoveRating();

  /**
   * 평점 생성, 수정 핸들러 함수
   * 평점을 매기고, 평균평점을 새로 불러온다
  //  * @param score 유저가 정한 평점
   * @param cb 버튼 눌렀을 때 loading 상태 제어할 콜백함수, () => setLoading(false)와 같은 함수가 들어올 예정
   */
  const createRatingHandler = useCallback((score: number|null, cb?: () => void) => {
    if (!creatorId) return;
    if (!score) {
      ShowSnack('평점을 매겨주세요', 'error', enqueueSnackbar);
    } else {
      createRating({
        creatorId,
        ratingPostDto: {
          rating: score,
          userId: authContext.user.userId,
          platform,
        },
        callback: cb,
      });
    }
  }, [authContext.user.userId, createRating, creatorId, enqueueSnackbar, platform]);

  /**
   * 평점 매긴거 취소하는 핸들러
   * @param cb 버튼 눌렀을 때 loading 상태 제어할 콜백함수, () => setLoading(false)와 같은 함수가 들어올 예정
   */
  const cancelRatingHandler = useCallback((cb?: () => void) => {
    if (!creatorId) return;
    removeRating({
      creatorId,
      userId: authContext.user.userId,
      callback: cb,
    });
  }, [authContext.user.userId, creatorId, removeRating]);

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
      <Grid item container xs={12}>
        <Grid item className={classes.avatarContainer} xs={4}>
          <Avatar className={classes.avatar} src={logo} />
        </Grid>

        <Grid item container className={classes.textContainer} xs={8}>

          <Grid item className={classes.nameContainer}>
            <Typography className={classes.nickname} component="div">
              {nickname}
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
              score={userRating ? userRating.score : undefined}
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
      </Grid>

    </>
  );
}
