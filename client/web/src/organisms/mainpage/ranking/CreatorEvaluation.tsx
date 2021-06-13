import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GoBackButton from '../../../atoms/Button/GoBackButton';
import useRatingData from '../../../utils/hooks/useRatingData';
import CreatorCommentList from './creatorInfo/CreatorCommentList';
import CreatorInfoCard from './creatorInfo/CreatorInfoCard';
import { useCreatorEvalutationCardStyle } from './style/Evaluation.style';

interface CreatorEvaluationProps {
  userData?: User;
}

/**
 * 인방랭킹 목록에서 크리에이터 이름 눌렀을 때 보여질 방송인정보 페이지 컴포넌트
 * @returns 
 */
export default function CreatorEvaluation({
  userData,
}: CreatorEvaluationProps): JSX.Element {
  const classes = useCreatorEvalutationCardStyle();
  const { creatorId, platform } = useParams<{creatorId: string, platform: 'afreeca'|'twitch'}>();
  const {
    ratings, scores, updateAverageRating, fetchCreatorRatingInfo,
  } = useRatingData({ platform, creatorId });

  // 컴포넌트 마운트 이후 1회 실행, 크리에이터 초기 정보를 가져온다
  useEffect(() => {
    fetchCreatorRatingInfo();

    // 화면 상단으로 
    if (window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.creatorEvaluationCardContainer}>
      <GoBackButton />

      <CreatorInfoCard
        updateAverageRating={updateAverageRating}
        user={userData}
        ratings={ratings}
        scores={scores}
      />
      <CreatorCommentList creatorId={creatorId} />
    </div>
  );
}
