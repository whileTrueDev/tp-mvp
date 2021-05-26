import { Typography } from '@material-ui/core';
import React from 'react';

export default function PageTitle({ text }: {text: string}): JSX.Element {
  return (
    <Typography
      color="textPrimary"
      style={{
        fontWeight: 700,
        padding: '8px',
      }}
    >
      {text}

    </Typography>
  );
}
