import { Hidden } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import THEME_TYPE from '../interfaces/ThemeType';

export type TrupointLogoProps = React.ImgHTMLAttributes<HTMLImageElement>
export default function TruepointLogo({
  width = 250,
  ...props
}: TrupointLogoProps): JSX.Element {
  const isDark = localStorage.getItem('themeType') === THEME_TYPE.DARK;

  return (
    <Link to="/">
      <Hidden smDown>
        <img
          src={isDark ? '/images/logo/logo_truepoint_v2_dark.png' : '/images/logo/logo_truepoint_v2_light.png'}
          alt=""
          width={width}
          {...props}
        />
      </Hidden>
      <Hidden smUp>
        <img
          src="/images/logo/logo_truepoint_v2_allwhite.png"
          alt=""
          width={width}
          {...props}
        />
      </Hidden>

    </Link>
  );
}
