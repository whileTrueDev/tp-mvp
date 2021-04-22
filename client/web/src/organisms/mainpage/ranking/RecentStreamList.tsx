import { useMediaQuery, useTheme } from '@material-ui/core';
import { RecentStreamResType } from '@truepoint/shared/dist/res/RecentStreamResType.interface';
import useAxios from 'axios-hooks';
import React, { useMemo } from 'react'
import useRecentStreamStyles from './style/RecentStream.styles';
import RecentStreamListItem from './streamInfo/RecentStreamListItem';
import { useParams } from 'react-router-dom';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import RecentStreamListLeftDecorator from './streamInfo/RecentStreamListLeftDecorator';

const listPositions = [
  { marginLeft: 16, height: 85 },
  { marginLeft: 70, height: 100 },
  { marginLeft: 110, height: 100 },
  { marginLeft: 80, height: 90 },
  { marginLeft: 16, height: undefined },
];

export default function RecentStreamList(): React.ReactElement {
  const classes = useRecentStreamStyles();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { creatorId, platform } = useParams<{creatorId: string, platform: 'afreeca'|'twitch'}>();

  const [userData] = useAxios<User>({ url: '/users', method:'get', params: { creatorId }});

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
          <RecentStreamListItem key={stream.streamId} stream={stream} />
        ))}
      </div>

      {/* 우측 스트리머 프로필이미지 */}
      {!userData.loading && userData.data && (
      <img
        draggable={false}
        style={{
          position: 'absolute', right: 0, top: 0, height: 600 - 16,
        }}
        src={theme.palette.type === 'light' ? userData.data.detail?.heroImageLight : userData.data.detail?.heroImageDark}
        alt=""
      />
      )}

      {/* 플랫폼 로고 이미지 */}
      {isSm ? (null) : (
        <RecentStreamListLeftDecorator themeType={theme.palette.type} platform={platform} />
      )}
    </section>

  );
}
