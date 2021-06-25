import React from 'react';

type Props = Record<string, any>

// 일반글=0, 공지글=1 일반글,공지글 구분용 컬럼
const CATEGORY_CODE = {
  0: '일반글',
  1: '공지글',
};

const CommunityPostCategoryLabel = ({ record }: Props): JSX.Element => {
  const { params } = record;
  const { category } = params;

  return (
    <div>{`${CATEGORY_CODE[category]}`}</div>
  );
};

export default CommunityPostCategoryLabel;
