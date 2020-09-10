import React from 'react';

export type TrupointLogoProps = React.ImgHTMLAttributes<HTMLImageElement>
export default function TruepointLogo({
  width = 250,
  ...props
}: TrupointLogoProps): JSX.Element {
  return (
    <img
      src="images/logo/logo_long_truepoint.png"
      alt=""
      width={width}
      {...props}
    />
  );
}
