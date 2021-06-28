import React from 'react';

import { CAROUSEL_HEIGHT } from '../../../../assets/constants';
import THEME_TYPE from '../../../../interfaces/ThemeType';

export default function RatingGuideBannerSlide(): JSX.Element {
  const isDark = localStorage.getItem('themeType') === THEME_TYPE.DARK;
  return (
    <div style={{
      height: CAROUSEL_HEIGHT,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    >
      <img src={`/images/rankingPage/rating_guide_banner_${isDark ? 'dark' : 'light'}.png`} height={CAROUSEL_HEIGHT} alt="별을 클릭하면 평점이 적용됩니다(*로그인 상태에서만 가능합니다)" />
    </div>
  );
}
