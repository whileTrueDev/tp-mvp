import React from 'react';
import { SvgIcon, SvgIconProps } from '@material-ui/core';

export default function MyInfoIcon(props: SvgIconProps): JSX.Element {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
      >
        <path
          d="M26.6,10.4l2.2-4.2L26,3.4,21.8,5.6a6.92,6.92,0,0,0-2.2-.8L18,0H14L12.4,4.6a8.45,8.45,0,0,0-2,.8L6.2,3.2l-3,3,2.2,4.2a8.45,8.45,0,0,0-.8,2L0,14v4l4.6,1.6c.2.8.6,1.4.8,2.2L3.2,26,6,28.8l4.2-2.2a6.92,6.92,0,0,0,2.2.8L14,32h4l1.6-4.6c.8-.2,1.4-.6,2.2-.8L26,28.8,28.8,26l-2.2-4.2a6.92,6.92,0,0,0,.8-2.2L32,18V14l-4.6-1.6A8.45,8.45,0,0,0,26.6,10.4ZM16,22a5.89,5.89,0,0,1-6-5.78V16a5.89,5.89,0,0,1,5.78-6H16a5.89,5.89,0,0,1,6,5.78V16a5.89,5.89,0,0,1-5.78,6Z"
        />
      </svg>
    </SvgIcon>
  );
}
