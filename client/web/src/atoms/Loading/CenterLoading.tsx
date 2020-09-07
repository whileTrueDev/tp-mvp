import React from 'react';
import { CircularProgress, CircularProgressProps } from '@material-ui/core';

export default function CenterLoading(props: CircularProgressProps): JSX.Element {
  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      bottom: '50%',
      transform: 'translate(-50%, 0)',
    }}
    >
      <CircularProgress {...props} />
    </div>
  );
}
