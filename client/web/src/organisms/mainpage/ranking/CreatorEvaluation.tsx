import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import useAxios from 'axios-hooks';
import { Button, Container } from '@material-ui/core';
import {
  CreatorRatingInfoRes, CreatorRatingCardInfo, CreatorAverageRatings, CreatorAverageScores,
} from '@truepoint/shared/dist/res/CreatorRatingResType.interface';
import CreatorInfoCard from './creatorInfo/CreatorInfoCard';
import CreatorCommentList from './creatorInfo/CreatorCommentList';
import RecentStreamList from './streamInfo/RecentStreamList';

const useCreatorEvalutationCardStyle = makeStyles((theme: Theme) => createStyles({
  creatorEvaluationCardContainer: {
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: `${theme.spacing(0.5)}px solid ${theme.palette.common.black}`,
    borderRadius: theme.spacing(0.5),
  },
  goBackButton: {
    position: 'absolute',
    zIndex: 1,
    top: '50%',
    left: `-${theme.spacing(9)}px`,
    width: theme.spacing(15),
    height: theme.spacing(15),
    borderRadius: '50%',
  },
  arrowIcon: {
    fontSize: theme.typography.h2.fontSize,
  },
}));

interface CreatorEvaluationProps {
  containerClassName: string;
}

/**
 * 인방랭킹 목록에서 크리에이터 이름 눌렀을 때 보여질 방송인정보 페이지 컴포넌트
 * @returns 
 */
export default function CreatorEvaluation({
  containerClassName,
}: CreatorEvaluationProps): JSX.Element {
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
    <>
      <RecentStreamList
        creatorId={creatorId}
        platform={platform}
      />
      <Container className={containerClassName}>
        <div className={classes.creatorEvaluationCardContainer}>
          <Button
            className={classes.goBackButton}
            onClick={history.goBack}
            aria-label="뒤로가기"
          >
            <img
              alt="뒤로가기 화살표 이미지"
              src="/images/rankingPage/backArrowImage.png"
              srcSet="images/rankingPage/backArrowImage@2x.png 2x"
            />
          </Button>
          <CreatorInfoCard
            updateAverageRating={updateAverageRating}
            info={info}
            ratings={ratings}
            scores={scores}
            userRating={userRating}
          />
          <CreatorCommentList creatorId={creatorId} />
        </div>
      </Container>
    </>

  );
}
