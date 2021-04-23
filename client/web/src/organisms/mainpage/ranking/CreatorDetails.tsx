import { Container } from '@material-ui/core';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import useAxios from 'axios-hooks';
import React from 'react';
import { useParams } from 'react-router-dom';
import CreatorEvaluation from './CreatorEvaluation';
import RecentStreamList from './RecentStreamList';
import { useRankingPageLayout } from './style/RankingPage.style';

export default function CreatorDetails(): React.ReactElement {
  const wrapper = useRankingPageLayout();
  const { creatorId, platform } = useParams<{creatorId: string, platform: 'afreeca'|'twitch'}>();
  const [userData] = useAxios<User>({ url: '/users', method: 'get', params: { creatorId } });

  return (
    <>
      {/* 최근 방송 정보 섹션 */}
      <RecentStreamList userData={userData} platform={platform} creatorId={creatorId} />

      <Container className={wrapper.container}>
        <CreatorEvaluation userData={userData.data} />
      </Container>
    </>
  );
}
