import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import CommunityBoardCommonLayout from '../../organisms/mainpage/communityBoard/CommunityBoardCommonLayout';

export default function CommunityPostWrite(): JSX.Element {
  const { postId } = useParams<any>();
  const location = useLocation<any>();
  const { platform } = location.state;
  return (
    <CommunityBoardCommonLayout>
      {`postId : ${postId}`}
      {`platform: ${platform}`}
      {JSON.stringify(location, null, 2)}
      {postId ? '개별글 수정 페이지' : '개별글 작성 페이지'}

    </CommunityBoardCommonLayout>
  );
}
