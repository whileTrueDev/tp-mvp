import { Typography } from '@material-ui/core';
import React from 'react';
import TruepointLogo from '../../../atoms/TruepointLogo';

export default function TitleWithLogo({ text }: {text: string}): JSX.Element {
  return (
    <div>
      <TruepointLogo width={90} />
      <Typography>{text}</Typography>
    </div>
  );
}
