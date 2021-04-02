import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import useAxios from 'axios-hooks';
import { Button } from '@material-ui/core';
import {
  CreatorRatingInfoRes, CreatorRatingCardInfo, CreatorAverageRatings, CreatorAverageScores,
} from '@truepoint/shared/dist/res/CreatorRatingResType.interface';
import CreatorInfoCard from './creatorInfo/CreatorInfoCard';

const useCreatorEvalutationCardStyle = makeStyles((theme: Theme) => createStyles({
  creatorEvaluationCardContainer: {
    border: `${theme.spacing(1)}px solid ${theme.palette.text.primary}`,
  },
  goBackButton: {
  },
}));

/**
 * 인방랭킹 목록에서 크리에이터 이름 눌렀을 때 보여질 방송인정보 페이지 컴포넌트
 * @returns 
 */
export default function CreatorEvaluation(
): JSX.Element {
  const classes = useCreatorEvalutationCardStyle();
  const history = useHistory();
  const { creatorId, platform } = useParams<{creatorId: string, platform: 'afreeca'|'twitch'}>();
  const [, getCreatorRatingInfo] = useAxios<CreatorRatingInfoRes>(`/ratings/info/${platform}/${creatorId}`, { manual: true });
  const [, refetchAverageRating] = useAxios<CreatorAverageRatings>(`/ratings/${creatorId}/average`, { manual: true });
  const [info, setInfo] = useState<CreatorRatingCardInfo>({
    platform,
    creatorId,
    logo: '',
    nickname: '',
  });
  // 해당 크리에이터에 대한 평균평점과 평가횟수
  const [ratings, setRatings] = useState<CreatorAverageRatings>({
    average: 0,
    count: 0,
  });
  const [scores, setScores] = useState<CreatorAverageScores>({
    admire: 0,
    smile: 0,
    frustrate: 0,
    cuss: 0,
  });
  // 요청한 사람이 매긴 평점
  const [userRating, setUserRating] = useState<null|number>(null);

  // 유저가 평점을 매긴 후 평균평점을 다시 불러온다
  const updateAverageRating = useCallback(() => {
    refetchAverageRating()
      .then((res) => {
        setRatings(res.data);
      })
      .catch((error) => console.error(error));
  }, [refetchAverageRating]);

  // 컴포넌트 마운트 이후 1회 실행, 크리에이터 초기 정보를 가져온다
  useEffect(() => {
    getCreatorRatingInfo()
      .then((res) => {
        setInfo((prevInfo) => ({ ...prevInfo, ...res.data.info }));
        setRatings(res.data.ratings);
        setScores(res.data.scores);
        setUserRating(res.data.userRating);
      })
      .catch((error) => console.error(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Button
        color="primary"
        className={classes.goBackButton}
        variant="contained"
        onClick={history.goBack}
      >
        뒤로가기

      </Button>
      <div className={classes.creatorEvaluationCardContainer}>

        <CreatorInfoCard
          updateAverageRating={updateAverageRating}
          info={info}
          ratings={ratings}
          scores={scores}
          userRating={userRating}
        />
      </div>
    </div>

  );
}
