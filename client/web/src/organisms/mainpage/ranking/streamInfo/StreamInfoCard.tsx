import {
  Avatar, Button, Grid, Typography, useTheme,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import { RecentStream } from '@truepoint/shared/dist/res/RecentStreamResType.interface';
import React, { useMemo } from 'react';
import VoteButton from '../../../../atoms/Button/VoteButton';
import { ScoresSection } from '../../shared/ScoresSection';
import { useProfileSectionStyles, useCreatorInfoCardStyles } from '../style/CreatorInfoCard.style';

const useStyles = makeStyles((theme: Theme) => ({
  linkText: {
    cursor: 'pointer',
    color: theme.palette.secondary.dark,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  streamTitle: {
    fontSize: theme.typography.h6.fontSize,
    fontWeight: theme.typography.fontWeightBold,
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.subtitle2.fontSize,
    },
  },
  contents: {
    marginLeft: theme.spacing(1),
    '&>*': {
      fontSize: theme.typography.body2.fontSize,
      [theme.breakpoints.down('sm')]: {
        fontSize: theme.spacing(1.25),
      },
    },
  },
  contentsHeader: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(0.5),
    fontSize: theme.typography.body2.fontSize,
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(1.25),
    },
  },
  contentsValue: {
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      alignItems: 'center',
      fontWeight: 500,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(1.25),
    },
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
}));

interface StreamInfoCardProps {
  creator?: User;
  stream?: RecentStream;
  loading?: boolean;
  onUpVote: () => Promise<void>;
  onDownVote: () => Promise<void>;
  onVoteCancel: (voteId: number) => void;
}

export default function StreamInfoCard({
  creator,
  stream,
  loading,
  onUpVote,
  onDownVote,
  onVoteCancel,
}: StreamInfoCardProps): React.ReactElement {
  const theme = useTheme();
  const classes = useProfileSectionStyles();
  const cardClasses = useCreatorInfoCardStyles();
  const streamInfoCardClasses = useStyles();

  const loadingView = useMemo(() => (
    <>
      <Grid item><Skeleton height={60} width={200} /></Grid>
      <Grid item>
        <Skeleton height={30} width={200} />
        <Skeleton height={30} width={200} />
        <Skeleton height={30} width={200} />
      </Grid>
      <Grid item>
        <Skeleton variant="circle" height={50} width={65} />
      </Grid>
    </>
  ), []);

  const twitchUrl = useMemo(() => (creator && creator.twitch ? `https://twitch.tv/${creator.twitch.twitchChannelName}` : ''), [creator]);
  const afreecaUrl = useMemo(() => (creator && creator.afreeca ? `https://bj.afreecatv.com/${creator.afreeca.afreecaId}` : ''), [creator]);

  const handleChannelClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Grid container className={cardClasses.left}>
      <Grid container item xs={12} md={12} justify="space-around" alignItems="center">
        <Grid item xs={3} sm={2} className={classes.avatarContainer}>
          <Avatar className={classes.avatar} src={creator ? (creator.afreeca?.logo || creator.twitch?.logo) : ''} />
        </Grid>
        {(loading && !stream && !creator)
          ? (loadingView)
          : stream && creator && (
          <>
            <Grid item xs={9} sm={5} container direction="column" spacing={1} alignItems="flex-start" justify="center">
              <Grid item>
                <Typography className={streamInfoCardClasses.streamTitle}>{stream.title}</Typography>
              </Grid>
              <Grid item className={streamInfoCardClasses.contents}>
                <Typography>{`${stream.startDate} ~ ${stream.endDate}`}</Typography>
                <Grid container direction="row">
                  <Typography className={streamInfoCardClasses.contentsHeader}>
                    최고 시청자수
                  </Typography>
                  <Typography className={streamInfoCardClasses.contentsValue}>
                    {`${stream.viewer ? stream.viewer.toLocaleString() : 0}명`}
                  </Typography>
                </Grid>
                <Grid container direction="row">
                  <Typography className={streamInfoCardClasses.contentsHeader}>
                    채팅 발생량
                    {' '}
                  </Typography>
                  <Typography className={streamInfoCardClasses.contentsValue}>
                    {`${stream.chatCount ? stream.chatCount.toLocaleString() : 0}회`}
                  </Typography>
                </Grid>
                {creator.twitch && twitchUrl && (
                <Typography className={streamInfoCardClasses.linkText} onClick={() => handleChannelClick(twitchUrl)}>
                  <img alt="트위치" src="/images/logo/twitchLogo.png" className={cardClasses.logo} />
                  {twitchUrl}
                </Typography>
                )}
                {creator.afreeca && afreecaUrl && (
                <Typography className={streamInfoCardClasses.linkText} onClick={() => handleChannelClick(afreecaUrl)}>
                  <img alt="아프리카" src="/images/logo/afreecaLogo.png" className={cardClasses.logo} />
                  {afreecaUrl}
                </Typography>
                )}
              </Grid>
              <Grid item>
                <VoteButton
                  type="up"
                  value={stream.likeCount}
                  size={theme.spacing(4)}
                  isVoted={stream?.voteHistory?.type}
                  onClick={() => onUpVote()}
                  onCancel={() => {
                    if (stream?.voteHistory && stream?.voteHistory.type === 'up') onVoteCancel(stream?.voteHistory.id);
                  }}
                />
                <VoteButton
                  type="down"
                  value={stream.hateCount}
                  size={theme.spacing(4)}
                  isVoted={stream?.voteHistory?.type}
                  onClick={() => onDownVote()}
                  onCancel={() => {
                    if (stream?.voteHistory && stream?.voteHistory.type === 'down') onVoteCancel(stream?.voteHistory.id);
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={5} container direction="column" spacing={1} className={streamInfoCardClasses.right}>
              <ScoresSection scores={stream.scores} />
            </Grid>
          </>
          )}
        {!loading && !stream && (
          <Grid item>
            <Typography>죄송합니다. 방송 데이터를 불러올 수 없습니다.</Typography>
            <Button variant="contained">돌아가기</Button>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
