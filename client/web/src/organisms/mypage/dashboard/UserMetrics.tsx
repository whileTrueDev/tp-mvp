import React from 'react';
import {
  Card, CardContent,
  Avatar, Grid, Typography,
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const BorderLinearProgress = withStyles((theme) => ({
  root: { height: 5, borderRadius: 5, },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: theme.palette.secondary.main,
  },
}))(LinearProgress);

const TruepointRating = withStyles((theme) => ({
  icon: { color: theme.palette.common.white },
  iconFilled: { color: theme.palette.secondary.main, },
  iconHover: { color: theme.palette.secondary.light },
}))(Rating);

export default function UserMetrics(): JSX.Element {
  const data = [
    {
      streamId: '123',
      platform: 'afreeca',
      userId: 'userId1',
      creatorId: 'afreecaId1',
      title: 'TEST_STREAM_123',
      viewer: 10,
      fan: 10,
      startedAt: '2020-09-12T17:00:00.000Z',
      airTime: 2,
      chatCount: 10000
    },
    {
      streamId: '124',
      platform: 'twitch',
      userId: 'userId1',
      creatorId: 'twitchId1',
      title: 'TEST_STREAM_124',
      viewer: 20,
      fan: 20,
      startedAt: '2020-09-12T17:00:00.000Z',
      airTime: 2,
      chatCount: 20000
    },
    {
      streamId: '125',
      platform: 'youtube',
      userId: 'userId1',
      creatorId: 'youtubeId1',
      title: 'TEST_STREAM_125',
      viewer: 30,
      fan: 30,
      startedAt: '2020-09-12T15:00:00.000Z',
      airTime: 2,
      chatCount: 10000
    },
    {
      streamId: '126',
      platform: 'afreeca',
      userId: 'userId1',
      creatorId: 'afreecaId1',
      title: 'TEST_STREAM_126',
      viewer: 10,
      fan: 10,
      startedAt: '2020-09-14T01:01:00.000Z',
      airTime: 3,
      chatCount: 20000
    },
    {
      streamId: '127',
      platform: 'twitch',
      userId: 'userId1',
      creatorId: 'twitchId1',
      title: 'TEST_STREAM_127',
      viewer: 20,
      fan: 20,
      startedAt: '2020-09-13T15:00:00.000Z',
      airTime: 3,
      chatCount: 20000
    },
    {
      streamId: '128',
      platform: 'youtube',
      userId: 'userId1',
      creatorId: 'youtubeId1',
      title: 'TEST_STREAM_128',
      viewer: 30,
      fan: 30,
      startedAt: '2020-09-13T18:00:00.000Z',
      airTime: 3,
      chatCount: 30000
    },
    {
      streamId: '129',
      platform: 'afreeca',
      userId: 'userId1',
      creatorId: 'afreecaId1',
      title: 'TEST_STREAM_129',
      viewer: 10,
      fan: 10,
      startedAt: '2020-09-14T18:00:00.000Z',
      airTime: 4,
      chatCount: 30000
    },
    {
      streamId: '130',
      platform: 'twitch',
      userId: 'userId1',
      creatorId: 'twitchId1',
      title: 'TEST_STREAM_130',
      viewer: 20,
      fan: 20,
      startedAt: '2020-09-14T16:00:00.000Z',
      airTime: 4,
      chatCount: 30000
    },
    {
      streamId: '131',
      platform: 'youtube',
      userId: 'userId1',
      creatorId: 'youtubeId1',
      title: 'TEST_STREAM_131',
      viewer: 30,
      fan: 30,
      startedAt: '2020-09-14T15:00:00.000Z',
      airTime: 6,
      chatCount: 40000
    },
    {
      streamId: '132',
      platform: 'afreeca',
      userId: 'userId1',
      creatorId: 'afreecaId1',
      title: 'TEST_STREAM_132',
      viewer: 10,
      fan: 10,
      startedAt: '2020-09-15T15:00:00.000Z',
      airTime: 5,
      chatCount: 50000
    },
    {
      streamId: '133',
      platform: 'twitch',
      userId: 'userId1',
      creatorId: 'twitchId1',
      title: 'TEST_STREAM_133',
      viewer: 20,
      fan: 20,
      startedAt: '2020-09-15T15:00:00.000Z',
      airTime: 7,
      chatCount: 40000
    },
    {
      streamId: '134',
      platform: 'youtube',
      userId: 'userId1',
      creatorId: 'youtubeId1',
      title: 'TEST_STREAM_134',
      viewer: 30,
      fan: 30,
      startedAt: '2020-09-15T15:00:00.000Z',
      airTime: 5,
      chatCount: 40000
    },
    {
      streamId: 'streamId10',
      platform: 'afreeca',
      userId: 'userId1',
      creatorId: 'afreecaId2',
      title: 'test2 stream',
      viewer: 100,
      fan: 100,
      startedAt: '2020-09-12T17:00:00.000Z',
      airTime: 7,
      chatCount: 10000
    },
    {
      streamId: 'streamId3',
      platform: 'afreeca',
      userId: 'userId1',
      creatorId: 'afcreatorId1',
      title: 'test stream',
      viewer: 200,
      fan: 200,
      startedAt: '2020-09-11T15:00:00.000Z',
      airTime: 7,
      chatCount: 20000
    },
    {
      streamId: 'streamId4',
      platform: 'afreeca',
      userId: 'userId1',
      creatorId: 'afcreatorId1',
      title: 'test stream',
      viewer: 300,
      fan: 300,
      startedAt: '2020-09-12T18:00:00.000Z',
      airTime: 6,
      chatCount: 30000
    },
    {
      streamId: 'streamId5',
      platform: 'youtube',
      userId: 'userId1',
      creatorId: 'youtubeId1',
      title: 'test stream',
      viewer: 20,
      fan: 20,
      startedAt: '2020-09-13T18:00:00.000Z',
      airTime: 7,
      chatCount: 2000
    },
    {
      streamId: 'streamId6',
      platform: 'youtube',
      userId: 'userId1',
      creatorId: 'youtubeId1',
      title: 'test stream',
      viewer: 10,
      fan: 10,
      startedAt: '2020-09-14T16:00:00.000Z',
      airTime: 6,
      chatCount: 1000
    }
  ];

  return (
    <>
      <Grid container spacing={2} style={{ marginBottom: 32 }}>
        <Grid item xs={3} container direction="column" alignItems="center">
          <Avatar
            src="https://avatars0.githubusercontent.com/u/42171155?s=400&u=72c333c5e2c44b64b16b7fef5670182c523d4c96&v=4"
            style={{ width: 150, height: 150, margin: '32px 32px 8px 32px' }}
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TruepointRating
              name="read-only"

              value={0.5}
              precision={0.5}
            />
            <Typography variant="h6" style={{ fontWeight: 'bold', color: 'white' }}>0.5</Typography>
          </div>
        </Grid>

        <Grid item xs={9} container direction="column" alignItems="center">
          <Typography variant="h1">그래프가</Typography>
          <Typography variant="h1">위치할 예정</Typography>
        </Grid>

        <Grid item xs={12} container spacing={2} style={{ marginTop: 32 }}>
          {[1233, 2516, 3434, 45454].map((card) => (
            <Grid item xs={3} key={card}>
              <Card>
                <div style={{ padding: '8px 16px' }}>
                  <Typography variant="h6">평균시청자</Typography>
                </div>
                <div style={{ padding: '0px 16px' }}>
                  <BorderLinearProgress variant="determinate" value={50} />
                </div>
                <CardContent style={{ padding: '8px 16px', marginBottom: 32 }}>
                  <Typography variant="h5" style={{ fontWeight: 900, lineHeight: 1.43 }}>{card.toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}

          <div style={{ marginTop: 16, marginBottom: 32 }}>
            <Typography variant="caption">* 통계 데이터는 시청자 50명, 구독자 500명 이상의 사용자를 기준으로 하며, 최근 일주일간의 데이터로 랭킹을 산정합니다.</Typography>
          </div>
        </Grid>
      </Grid>
    </>
  );
}
