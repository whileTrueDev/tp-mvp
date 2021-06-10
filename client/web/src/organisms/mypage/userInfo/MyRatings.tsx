import { Avatar } from '@material-ui/core';
import React from 'react';
import TitleWithLogo from './TitleWithLogo';

export default function MyRatings(): JSX.Element {
  return (
    <div>
      <TitleWithLogo text="내 평점 보기" />
      <Avatar />
    </div>
  );
}
