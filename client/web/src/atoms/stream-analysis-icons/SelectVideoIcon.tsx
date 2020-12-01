import React from 'react';
import { SvgIcon, SvgIconProps } from '@material-ui/core';

export default function SelectVideoIcon(props: SvgIconProps): JSX.Element {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
      >
        <path
          d="M30.82,2h-3a1,1,0,0,0-.71.29L25.41,4H23.82V3a3,3,0,0,0-3-3h-18a3,3,0,0,0-3,3V19a3,3,0,0,0,3,3h18a3,3,0,0,0,3-3V18h1.59l1.71,1.71a1,1,0,0,0,.7.29h3a1,1,0,0,0,1-1V3A1,1,0,0,0,30.82,2Zm-1,16H28.23l-1.71-1.71a1,1,0,0,0-.7-.29h-3a1,1,0,0,0-1,1v2a1,1,0,0,1-1,1h-18a1,1,0,0,1-1-1V3a1,1,0,0,1,1-1h18a1,1,0,0,1,1,1V13h2V6h2a1,1,0,0,0,.71-.29L28.23,4h1.59Z"
        />
      </svg>
    </SvgIcon>
  );
}
