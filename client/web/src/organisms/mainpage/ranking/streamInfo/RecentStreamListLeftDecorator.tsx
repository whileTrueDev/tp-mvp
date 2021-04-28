import React from 'react';

interface RecentStreamListLeftDecoratorProps {
  platform: 'twitch' | 'afreeca';
  themeType: 'dark' | 'light';
}

export default function RecentStreamListLeftDecorator({
  platform,
  themeType,
}: RecentStreamListLeftDecoratorProps): React.ReactElement {
  return (
    <img
      src={`/images/rankingPage/broadPage/${platform}_bg_${themeType}.png`}
      style={{
        position: 'absolute', left: -230, top: 24, width: 500, height: 500,
      }}
      alt=""
    />
  );
}
