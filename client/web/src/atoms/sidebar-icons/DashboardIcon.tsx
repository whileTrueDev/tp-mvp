import React from 'react';
import { SvgIcon, SvgIconProps } from '@material-ui/core';

export default function DashBoardIcon(props: SvgIconProps): JSX.Element {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
      >
        <path
          d="M31.16,10.37l-14-10a2,2,0,0,0-2.32,0l-14,10a2,2,0,1,0,2.32,3.26L4,
          13V30a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2V13a3.38,3.38,0,0,0,2,1,2,2,0,0,0,
          1.16-3.63ZM24,28H20V22a4,4,0,0,0-8,0v6H8V10.17l8-5.71,8,5.71Z"
        />
      </svg>
    </SvgIcon>
  );
}
