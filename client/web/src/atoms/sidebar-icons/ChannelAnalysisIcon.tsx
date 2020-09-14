import React from 'react';
import { SvgIcon, SvgIconProps } from '@material-ui/core';

export default function ChannelAnalysisIcon(props: SvgIconProps): JSX.Element {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
      >
        <path
          d="M26,32a1.89,1.89,0,0,1-2-1.77V12a1.89,1.89,0,0,1,1.77-2H30a1.89,1.89,0,0,1,2,1.77V30a1.89,1.89,0,0,1-1.77,2H26ZM14,32a1.89,1.89,0,0,1-2-1.77V2a1.89,1.89,0,0,1,1.77-2H18a1.89,1.89,0,0,1,2,1.77V30a1.89,1.89,0,0,1-1.77,2H14ZM2,32a1.89,1.89,0,0,1-2-1.77V22a1.89,1.89,0,0,1,1.78-2H6a1.89,1.89,0,0,1,2,1.78V30a1.89,1.89,0,0,1-1.77,2H2Z"
        />
      </svg>
    </SvgIcon>
  );
}
