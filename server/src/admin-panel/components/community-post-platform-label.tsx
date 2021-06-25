import React from 'react';

type Props = Record<string, any>

// 아프리카=0, 트위치=1, 자유게시판=2 플랫폼 구분용 컬럼
const PLATFORM_CODE = {
  0: '아프리카',
  1: '트위치',
  2: '자유게시판',
};

const CommunityPostPlatformLabel = ({ record }: Props): JSX.Element => {
  const { params } = record;
  const { platform } = params;

  return (
    <div>{`${PLATFORM_CODE[platform]}`}</div>
  );
};

export default CommunityPostPlatformLabel;
