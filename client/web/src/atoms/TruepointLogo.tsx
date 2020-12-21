import React from 'react';
import { Link } from 'react-router-dom';

export type TrupointLogoProps = React.ImgHTMLAttributes<HTMLImageElement>
export default function TruepointLogo({
  width = 250,
  ...props
}: TrupointLogoProps): JSX.Element {
  return (
    <Link to="/">
      <img
        src="/images/logo/new_tp_logo_black.png"
        alt=""
        width={width}
        {...props}
      />
    </Link>
  );
}
