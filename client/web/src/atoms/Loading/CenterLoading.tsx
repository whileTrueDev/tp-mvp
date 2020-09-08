import React from 'react';
import { CircularProgress, CircularProgressProps } from '@material-ui/core';

export interface CenterLoadingProps extends CircularProgressProps {
  position?: 'absolute' | 'relative'
}

export default function CenterLoading({
  position = 'absolute',
  ...props
}: CenterLoadingProps): JSX.Element {
  return (
    <div style={{
      position,
      left: '50%',
      bottom: '50%',
      transform: 'translate(-50%, 0)',
    }}
    >
      <CircularProgress {...props} />
    </div>
  );
}
