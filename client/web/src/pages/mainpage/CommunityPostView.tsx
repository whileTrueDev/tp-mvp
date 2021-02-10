import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import CommunityBoardCommonLayout from '../../organisms/mainpage/communityBoard/CommunityBoardCommonLayout';

export default function CommunityPostView(): JSX.Element {
  const { postId } = useParams<any>();
  const location = useLocation();
  return (
    <CommunityBoardCommonLayout>
      {JSON.stringify(postId, null, 2)}
      {JSON.stringify(location, null, 2)}
      개별글 조회 페이지
    </CommunityBoardCommonLayout>
  );
}
