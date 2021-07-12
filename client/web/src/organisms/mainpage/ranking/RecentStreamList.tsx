import {
  Typography, useMediaQuery, useTheme,
} from '@material-ui/core';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import { RecentStreamResType } from '@truepoint/shared/dist/res/RecentStreamResType.interface';
import useAxios, { ResponseValues } from 'axios-hooks';
import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import PageTitle from '../shared/PageTitle';
import RecentStreamListItem from './streamInfo/RecentStreamListItem';
import useRecentStreamStyles from './style/RecentStream.styles';

interface RecentStreamListProps {
  userData: ResponseValues<User, any>;
  creatorId: string;
}
export default function RecentStreamList({
  userData,
  creatorId,
}: RecentStreamListProps): React.ReactElement {
  const classes = useRecentStreamStyles();
  const history = useHistory();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const platform = userData.data?.afreeca ? 'afreeca' : 'twitch';

  const [{ data, error }] = useAxios<RecentStreamResType>({
    url: '/broadcast-info/bycreator',
    method: 'GET',
    params: { creatorId, limit: 5 },
  });

  const dataSource = useMemo(() => {
    if (!data) return [];
    return data;
  }, [data]);

  if (isSm) {
    return (

      <section className={classes.itembox}>
        <PageTitle text="최근 방송" />
        {!error && dataSource && dataSource.map((stream) => (
          <RecentStreamListItem
            key={stream.streamId}
            stream={stream}
            onClick={() => {
              history.push(`/ranking/${creatorId}/stream/${stream.streamId}`, userData.data);
            }}
          />
        ))}
      </section>
    );
  }

  return (
    <section className={classes.section} id="broad-list">

      {/* 스트리머 프로필이미지 */}
      {!userData.loading && userData.data && (
        <img
          draggable={false}
          className={classes.profileImage}
          src={theme.palette.type === 'light' ? userData.data.detail?.heroImageLight : userData.data.detail?.heroImageDark}
          alt=""
        />
      )}

      <section className={classes.streamListSection}>
        <Typography className={classes.titleText}>방송 후기 게시판</Typography>
        <div
          className={classes.itembox}
        >
          {!error && dataSource && dataSource.map((stream) => (
            <RecentStreamListItem
              key={stream.streamId}
              stream={stream}
              onClick={() => {
                history.push(`/ranking/${creatorId}/stream/${stream.streamId}`, userData.data);
              }}
            />
          ))}
        </div>
      </section>

    </section>

  );
}
