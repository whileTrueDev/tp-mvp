import { Typography, useMediaQuery, useTheme } from '@material-ui/core';
import { RecentStreamResType } from '@truepoint/shared/dist/res/RecentStreamResType.interface';
import useAxios from 'axios-hooks';
import React, { useMemo } from 'react';
import useRecentStreamStyles from '../style/RecentStream.styles';
import RecentStreamListItem from './RecentStreamListItem';

const listPositions = [
  { marginLeft: 16, height: 85 },
  { marginLeft: 70, height: 100 },
  { marginLeft: 110, height: 100 },
  { marginLeft: 80, height: 90 },
  { marginLeft: 16, height: undefined },
];
export interface RecentStreamListProps {
  platform: string;
  creatorId: string;
}
export default function RecentStreamList({
  creatorId,
  platform,
}: RecentStreamListProps): React.ReactElement {
  const classes = useRecentStreamStyles();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const [{ data, error }] = useAxios<RecentStreamResType>({
    url: '/broadcast-info/bycreator',
    method: 'GET',
    params: { creatorId, limit: 5 },
  });

  function createListData(d: RecentStreamResType) {
    return d.map((_d, idx) => ({
      ..._d,
      marginLeft: listPositions[idx].marginLeft,
      height: listPositions[idx].height,
    }));
  }

  const dataSource = useMemo(() => {
    if (!data) return [];
    return createListData(data);
  }, [data]);

  return (
    <section className={classes.section} id="broad-list">
      <div className={classes.itembox}>
        {!error && dataSource && dataSource.map((stream) => (
          <RecentStreamListItem key={stream.title} stream={stream} />
        ))}
      </div>

      {/* 우측 스트리머 프로필이미지 */}
      <img
        draggable={false}
        style={{
          position: 'absolute', right: 0, top: 0, height: 600 - 16,
        }}
        src={theme.palette.type === 'light' ? '/images/rankingPage/broadPage/랄로배경.png' : '/images/rankingPage/broadPage/랄로배경2.png'}
        alt=""
      />

      {/* 플랫폼 로고 이미지 */}
      {isSm ? (null) : (
        <img
          src={`/images/rankingPage/broadPage/${platform}_bg_${theme.palette.type}.png`}
          style={{
            position: 'absolute', left: -230, top: 24, width: 500, height: 500,
          }}
          alt=""
        />
      )}
    </section>

  );
}
