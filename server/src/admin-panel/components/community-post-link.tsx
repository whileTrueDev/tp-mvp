import React from 'react';
import getFrontHost from '../../utils/getFrontHost';

// 아프리카=0, 트위치=1, 자유게시판=2 플랫폼 구분용 컬럼
const PLATFORM_NAME = {
  0: 'afreeca',
  1: 'twitch',
  2: 'free',
};

type Props = Record<string, any>

const CommunityPostLink = ({ record }: Props): JSX.Element => {
  const { params } = record;
  const { platform, postId } = params;

  const href = `${getFrontHost()}/community-board/${PLATFORM_NAME[platform]}/view/${postId}`;

  return (
    <div style={{ marginBottom: '24px' }}>
      <p style={{ color: 'grey' }}>그림이나 동영상이 깨지는 경우</p>
      <a href={href} target="_blank" rel="noreferrer">해당 페이지에서 확인하기</a>
    </div>

  );
};

export default CommunityPostLink;
