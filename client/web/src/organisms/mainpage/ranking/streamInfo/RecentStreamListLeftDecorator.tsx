import React from 'react';
import useRecentStreamStyles from '../style/RecentStream.styles';

interface RecentStreamListLeftDecoratorProps {
  platform: 'twitch' | 'afreeca';
  themeType: 'dark' | 'light';
}

export default function RecentStreamListLeftDecorator({
  platform,
  themeType,
}: RecentStreamListLeftDecoratorProps): React.ReactElement {
  const classes = useRecentStreamStyles();
  return (
    <img
      src={`/images/rankingPage/broadPage/${platform}_bg_${themeType}.png`}
      className={classes.leftDecorator}
      alt=""
    />
  );
}
