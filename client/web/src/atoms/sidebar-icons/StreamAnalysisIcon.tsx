import React from 'react';
import { SvgIcon, SvgIconProps } from '@material-ui/core';

export default function StreamAnalysisIcon(props: SvgIconProps): JSX.Element {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
      >
        <path
          d="M29.33,0H2.67A2.68,2.68,0,0,0,0,2.67V29.33A2.68,2.68,0,0,0,2.67,32H29.33A2.68,2.68,0,0,0,32,29.33V2.67A2.68,2.68,0,0,0,29.33,0Zm-24,28H2.67V25.33H5.33Zm0-6.67H2.67V18.67H5.33Zm0-8H2.67V10.67H5.33Zm0-6.66H2.67V4H5.33ZM24,26.67H8V17.33H24Zm0-12H8V5.33H24ZM29.33,28H26.67V25.33h2.66Zm0-6.67H26.67V18.67h2.66Zm0-8H26.67V10.67h2.66Zm0-6.66H26.67V4h2.66Z"
        />
      </svg>
    </SvgIcon>
  );
}
