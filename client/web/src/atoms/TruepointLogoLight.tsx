import React from 'react';
import { Link } from 'react-router-dom';

export type TrupointLogoProps = React.ImgHTMLAttributes<HTMLImageElement>
export default function TruepointLogoLigth({
  width = 250,
  ...props
}: TrupointLogoProps): JSX.Element {
  return (
    <Link to="/">
      <img
        src="/images/logo/logo_truepoint_v2_light.png"
        alt=""
        width={width}
        {...props}
      />
    </Link>
  );
}
