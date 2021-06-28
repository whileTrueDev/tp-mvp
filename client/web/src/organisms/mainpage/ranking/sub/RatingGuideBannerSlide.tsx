import React from 'react';
import { CAROUSEL_HEIGHT } from '../../../../assets/constants';

export default function RatingGuideBannerSlide(): JSX.Element {
  return (
    <div style={{
      height: CAROUSEL_HEIGHT,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    >
      <img src="/images/rankingPage/rating_guide_banner.png" height={CAROUSEL_HEIGHT} alt="별을 클릭하면 평점이 적용됩니다(*로그인 상태에서만 가능합니다)" />
    </div>
  );
}
