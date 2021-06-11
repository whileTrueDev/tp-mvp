import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import THEME_TYPE from '../interfaces/ThemeType';

export interface TrupointLogoProps extends React.ImgHTMLAttributes<HTMLImageElement>{
  type?: 'white' | 'dark' | 'light';
}

export default function TruepointLogo({
  width = 250,
  ...props
}: TrupointLogoProps): JSX.Element {
  const { type = 'light' } = props;
  const isDark = localStorage.getItem('themeType') === THEME_TYPE.DARK;

  const logoSrc = useMemo(() => {
    if (isDark) {
      if (type === 'white') {
        return '/images/logo/logo_truepoint_v2_allwhite.png';
      }
      return '/images/logo/logo_truepoint_v2_dark.png';
    }
    if (type === 'dark') {
      return '/images/logo/logo_truepoint_v2_dark.png';
    }
    if (type === 'white') {
      return '/images/logo/logo_truepoint_v2_allwhite.png';
    }
    // 기본 type = 'light'
    return '/images/logo/logo_truepoint_v2_light.png';
  }, [isDark, type]);

  return (
    <Link to="/">
      <img
        src={logoSrc}
        alt=""
        width={width}
        {...props}
      />

    </Link>
  );
}
