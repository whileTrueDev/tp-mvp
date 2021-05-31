import React from 'react';
import { CAROUSEL_HEIGHT } from '../../../../assets/constants';

export default function SearchGuideBannerSlide(): JSX.Element {
  return (
    <div style={{
      height: CAROUSEL_HEIGHT,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    >
      <img src="/images/rankingPage/search_guide_banner.png" alt="검색이 안되는 방송인은 '기능제안'에서 방송인 추가 요청 글을 남겨주세요!" />
    </div>
  );
}
