import React from 'react';
import useScrollTop from '../../utils/hooks/useScrollTop';

export default function Introduction(): JSX.Element {
  // 처음 페이지 렌더링시 화면 최상단으로 스크롤이동
  useScrollTop();
  return (<div>Introduction</div>);
}
