import { Typography, Hidden } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import React from 'react';

export default function PageTitle({ text }: {text: string}): JSX.Element|null {
  const theme = useTheme();

  return (
    <Hidden smUp>
      <Typography
        color="textPrimary"
        style={{
          fontWeight: 700,
          padding: '8px',
          background: theme.palette.background.paper,
        }}
      >
        {text}

      </Typography>
    </Hidden>
  );
}
