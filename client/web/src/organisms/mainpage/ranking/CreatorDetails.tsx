import {
  Container, Divider, Grid, Paper,
} from '@material-ui/core';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import useAxios from 'axios-hooks';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GoBackButton from '../../../atoms/Button/GoBackButton';
import useMediaSize from '../../../utils/hooks/useMediaSize';
import useRatingData from '../../../utils/hooks/useRatingData';
import PageTitle from '../shared/PageTitle';
// import CreatorEvaluation from './CreatorEvaluation';
import CreatorCommentList from './creatorInfo/CreatorCommentList';
import { ProfileSection, ScoresSection } from './creatorInfo/CreatorInfoCard';
import RecentStreamList from './RecentStreamList';
import { useCreatorInfoCardStyles } from './style/CreatorInfoCard.style';
import { useCreatorEvalutationCardStyle } from './style/Evaluation.style';
import { useRankingPageLayout } from './style/RankingPage.style';

export default function CreatorDetails(): React.ReactElement {
  const { container } = useRankingPageLayout();
  const { creatorEvaluationCardContainer } = useCreatorEvalutationCardStyle();
  const classes = useCreatorInfoCardStyles();
  const { creatorId, platform } = useParams<{creatorId: string, platform: 'afreeca'|'twitch'}>();
  const { isMobile } = useMediaSize();
  const {
    info, ratings, scores, updateAverageRating, fetchCreatorRatingInfo,
  } = useRatingData({ platform, creatorId });
  const [userData] = useAxios<User>({ url: '/users', method: 'get', params: { creatorId } });

  // 컴포넌트 마운트 이후 1회 실행, 크리에이터 초기 정보를 가져온다
  useEffect(() => {
    fetchCreatorRatingInfo();

    // 화면 상단으로 
    if (window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 모바일 레이아웃
  if (isMobile) {
    return (
      <>
        <Paper style={{ padding: '4px', marginBottom: '4px' }}>

          <PageTitle text="방송인 상세페이지" />
          <GoBackButton />
          <Grid container style={{ border: '1px solid grey', position: 'relative' }}>
            <ProfileSection
              user={userData.data}
              ratings={ratings}
              info={info}
              updateAverageRating={updateAverageRating}
            />
          </Grid>

          <RecentStreamList userData={userData} platform={platform} creatorId={creatorId} />
        </Paper>

        <Paper style={{ padding: '4px', marginBottom: '4px' }}>
          <ScoresSection scores={scores} />
        </Paper>
        <Paper style={{ padding: '4px', marginBottom: '4px' }}>
          <CreatorCommentList creatorId={creatorId} />
        </Paper>

      </>
    );
  }

  // 데스크탑 레이아웃
  return (
    <>

      {/* 최근 방송 정보 섹션 */}
      <Container className={container}>
        <RecentStreamList userData={userData} platform={platform} creatorId={creatorId} />

      </Container>

      <Container className={container}>
        <div className={creatorEvaluationCardContainer}>
          <GoBackButton />

          <Grid container className={classes.creatorInfoContainer}>
            {/* 왼쪽 크리에이터 기본설명, 평점 */}
            <Grid container item className={classes.left} xs={7}>
              <ProfileSection
                user={userData.data}
                ratings={ratings}
                info={info}
                updateAverageRating={updateAverageRating}
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
    </>
  );
}
