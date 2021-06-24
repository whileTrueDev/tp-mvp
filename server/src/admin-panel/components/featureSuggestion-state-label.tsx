import React from 'react';

type Props = Record<string, any>

// 기능제안 상태 플래그 0=미확인, 1=검토중 2=개발확정, 3=개발보류
const STATE_CODE = {
  0: '미확인',
  1: '검토중',
  2: '개발확정',
  3: '개발보류',
};

const FeatureSuggestionStateLabel = ({ record }: Props): JSX.Element => {
  const { params } = record;
  const { state } = params;

  return (
    <div>{`${STATE_CODE[state]}`}</div>
  );
};

export default FeatureSuggestionStateLabel;
