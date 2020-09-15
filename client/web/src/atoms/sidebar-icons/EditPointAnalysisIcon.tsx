import React from 'react';
import { SvgIcon, SvgIconProps } from '@material-ui/core';

export default function EditPointAnalysisIcon(props: SvgIconProps): JSX.Element {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
      >
        <path
          d="M28,32V0h4V32ZM0,32V0H4V32ZM22,22V0h4V22ZM12,22V0h8V22ZM6,22V0h4V22Z"
        />
      </svg>
    </SvgIcon>
  );
}
