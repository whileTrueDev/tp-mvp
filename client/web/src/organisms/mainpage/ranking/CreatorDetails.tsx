import {
  Container, Divider, Grid, Paper,
} from '@material-ui/core';
import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import GoBackButton from '../../../atoms/Button/GoBackButton';
import useMediaSize from '../../../utils/hooks/useMediaSize';
import PageTitle from '../shared/PageTitle';
import CreatorCommentList from './creatorInfo/CreatorCommentList';
import { ProfileSection } from './creatorInfo/ProfileSection';
import { ScoresSection } from '../shared/ScoresSection';
import { useCreatorInfoCardStyles } from './style/CreatorInfoCard.style';
import { useCreatorEvalutationCardStyle } from './style/Evaluation.style';
import { useRankingPageLayout } from './style/RankingPage.style';
import RankingPageCommonLayout from './RankingPageCommonLayout';
import PageNotFound from '../../../pages/others/PageNotFound';
import ScoresHistorySection from './creatorInfo/ScoresHistorySection';
import useCreatorAverageRatings from '../../../utils/hooks/query/useCreatorAverageRatings';
import useCreatorAverageScores from '../../../utils/hooks/query/useCreatorAverageScores';
import useCreatorDetailData from '../../../utils/hooks/query/useCreatorDetailData';

export default function CreatorDetails(): React.ReactElement {
  const { container } = useRankingPageLayout();
  const { creatorEvaluationCardContainer } = useCreatorEvalutationCardStyle();
  const classes = useCreatorInfoCardStyles();
  const { creatorId } = useParams<{creatorId: string}>();
  const { isMobile } = useMediaSize();
  const { data: avgRatings } = useCreatorAverageRatings(creatorId);
  const { data: avgScores } = useCreatorAverageScores(creatorId);
  const { data: userData, isFetching } = useCreatorDetailData(creatorId);

  // 컴포넌트 마운트 이후 1회 실행
  useEffect(() => {
    // 화면 상단으로 
    if (window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scores = useMemo(() => (avgScores
    || {
      smile: 0,
      frustrate: 0,
      admire: 0,
      cuss: 0,
      cussRank: 0,
      smileRank: 0,
      admireRank: 0,
      frustrateRank: 0,
      total: 0,
    }), [avgScores]);

  const ratings = useMemo(() => avgRatings || { average: 0, count: 0 }, [avgRatings]);

  // 로딩중이 아닌데 유저데이터 없을때 -> 존재하지 않는 유저
  // if (!userData.loading && !userData.data) {
  if (!isFetching && !userData) {
    return <PageNotFound />;
  }

  // 모바일 레이아웃
  if (isMobile) {
    return (
      <RankingPageCommonLayout>
        <Paper style={{ padding: '4px', marginBottom: '4px' }}>

          <PageTitle text="방송인 상세페이지" />
          <GoBackButton />
          <Grid container style={{ border: '1px solid grey', position: 'relative' }}>
            <ProfileSection
              userData={userData}
              ratings={ratings}
            />
          </Grid>
          <ScoresHistorySection creatorId={creatorId} />
        </Paper>

        <Paper style={{ padding: '4px', marginBottom: '4px' }}>
          <ScoresSection scores={scores} />
        </Paper>
        <Paper style={{ padding: '4px', marginBottom: '4px' }}>
          <CreatorCommentList creatorId={creatorId} />
        </Paper>

      </RankingPageCommonLayout>
    );
  }

  // 데스크탑 레이아웃
  return (
    <RankingPageCommonLayout>

      {/* 최근 방송 정보 섹션 */}
      <Container className={container}>
        <ScoresHistorySection creatorId={creatorId} />
      </Container>

      <Container className={container}>
        <div className={creatorEvaluationCardContainer}>
          <GoBackButton />

          <Grid container className={classes.creatorInfoContainer}>
            {/* 왼쪽 크리에이터 기본설명, 평점 */}
            <Grid container item className={classes.left} xs={7}>
              <ProfileSection
                userData={userData}
                ratings={ratings}
              />
            </Grid>
            {/* 오른쪽 크리에이터 점수 */}
            <Grid item className={classes.right} xs={5}>
              <ScoresSection scores={scores} />
            </Grid>
          </Grid>

          <Divider variant="middle" />

          {/* 댓글 부분 */}
          <CreatorCommentList creatorId={creatorId} />
        </div>
      </Container>
    </RankingPageCommonLayout>
  );
}
