import { Typography } from '@material-ui/core';
import React from 'react';
import useMediaSize from '../../../utils/hooks/useMediaSize';

export default function PageTitle({ text }: {text: string}): JSX.Element|null {
  const { isMobile } = useMediaSize();
  return (
    isMobile ? (
      <Typography
        color="textPrimary"
        style={{
          fontWeight: 700,
          padding: '8px',
        }}
      >
        {text}

      </Typography>
    ) : null

  );
}
