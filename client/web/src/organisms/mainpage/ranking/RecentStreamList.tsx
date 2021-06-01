import { Container, useMediaQuery, useTheme } from '@material-ui/core';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import { RecentStreamResType } from '@truepoint/shared/dist/res/RecentStreamResType.interface';
import useAxios, { ResponseValues } from 'axios-hooks';
import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import PageTitle from '../shared/PageTitle';
import RecentStreamListItem from './streamInfo/RecentStreamListItem';
import RecentStreamListLeftDecorator from './streamInfo/RecentStreamListLeftDecorator';
import useRecentStreamStyles from './style/RecentStream.styles';

const listPositions = [
  { marginLeft: 70 },
  { marginLeft: 120 },
  { marginLeft: 130 },
  { marginLeft: 120 },
  { marginLeft: 70 },
];
interface RecentStreamListProps {
  userData: ResponseValues<User, any>;
  creatorId: string;
  platform: 'twitch' | 'afreeca',
}
export default function RecentStreamList({
  userData,
  creatorId,
  platform,
}: RecentStreamListProps): React.ReactElement {
  const classes = useRecentStreamStyles();
  const history = useHistory();
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
    }));
  }

  const dataSource = useMemo(() => {
    if (!data) return [];
    return createListData(data);
  }, [data]);

  if (isSm) {
    return (

      <section>
        <PageTitle text="최근 방송" />
        {!error && dataSource && dataSource.map((stream) => (
          <RecentStreamListItem
            key={stream.streamId}
            stream={stream}
            onClick={() => {
              history.push(`${window.location.pathname}/${stream.streamId}`, userData.data);
            }}
          />
        ))}
      </section>
    );
  }

  return (
    <section className={classes.section} id="broad-list">
      <Container style={{ position: 'relative', overflow: 'hidden' }}>
        <div className={classes.itembox}>
          {!error && dataSource && dataSource.map((stream) => (
            <RecentStreamListItem
              key={stream.streamId}
              stream={stream}
              onClick={() => {
                history.push(`${window.location.pathname}/${stream.streamId}`, userData.data);
              }}
            />
          ))}
        </div>

        {/* 우측 스트리머 프로필이미지 */}
        {!userData.loading && userData.data && (
        <img
          draggable={false}
          className={classes.profileImage}
          src={theme.palette.type === 'light' ? userData.data.detail?.heroImageLight : userData.data.detail?.heroImageDark}
          alt=""
        />
        )}

        {/* 플랫폼 로고 이미지 */}
        {isSm ? (null) : (<RecentStreamListLeftDecorator themeType={theme.palette.type} platform={platform} />)}
      </Container>

    </section>

  );
}
