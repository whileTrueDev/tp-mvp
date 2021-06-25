import React from 'react';
import { PLATFORM_CODE } from './community-post-platform-label';
import getFrontHost from '../../utils/getFrontHost';

type Props = Record<string, any>

const CommunityPostLink = ({ record }: Props): JSX.Element => {
  const { params } = record;
  const { platform, postId } = params;
  const href = `${getFrontHost()}/community-board/${PLATFORM_CODE[platform]}/view/${postId}`;

  return (
    <div style={{ marginBottom: '24px' }}>
      <p style={{ color: 'grey' }}>그림이나 동영상이 깨지는 경우</p>
      <a href={href} target="_blank" rel="noreferrer">해당 페이지에서 확인하기</a>
    </div>

  );
};

export default CommunityPostLink;
