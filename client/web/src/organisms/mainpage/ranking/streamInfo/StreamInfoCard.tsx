import {
  Avatar, Button, Grid, Typography, useTheme,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import { RecentStream } from '@truepoint/shared/dist/res/RecentStreamResType.interface';
import React, { useMemo } from 'react';
import VoteButton from '../../../../atoms/Button/VoteButton';
import { useCreatorInfoCardStyles } from '../style/CreatorInfoCard.style';

const useStyles = makeStyles((theme) => ({
  linkText: {
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

interface StreamInfoCardProps {
  creator: User;
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
  const classes = useCreatorInfoCardStyles();
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

  const twitchUrl = useMemo(() => (creator.twitch ? `https://twitch.tv/${creator.twitch.twitchChannelName}` : ''), [creator.twitch]);
  const afreecaUrl = useMemo(() => (creator.afreeca ? `https://afreeca.tv/${creator.afreeca.afreecaId}` : ''), [creator.afreeca]);

  const handleChannelClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Grid container className={classes.left}>
      <Grid container item xs={12} md={9} justify="center" alignItems="center">
        <Grid item xs={4} className={classes.avatarContainer}>
          <Avatar className={classes.avatar} src={creator.afreeca?.logo || creator.twitch?.logo || ''} />
        </Grid>

        <Grid item xs={8} container direction="column" spacing={2} alignItems="flex-start" justify="flex-start">
          {(loading && !stream)
            ? (loadingView)
            : stream && (
              <>
                <Grid item>
                  <Typography variant="h4">{stream.title}</Typography>
                </Grid>
                <Grid item>
                  <Typography>{`${stream.startDate} ~ ${stream.endDate}`}</Typography>
                  <Typography>{`평균 시청자수 ${stream.viewer ? stream.viewer.toLocaleString() : 0} 명`}</Typography>
                  <Typography>{`채팅 발생량 ${stream.chatCount ? stream.chatCount.toLocaleString() : 0} 회`}</Typography>
                  {creator.twitch && twitchUrl && (
                  <Typography className={streamInfoCardClasses.linkText} onClick={() => handleChannelClick(twitchUrl)}>
                    <img alt="트위치" src="/images/logo/twitchLogo.png" className={classes.logo} />
                    {twitchUrl}
                  </Typography>
                  )}
                  {creator.afreeca && afreecaUrl && (
                  <Typography className={streamInfoCardClasses.linkText} onClick={() => handleChannelClick(afreecaUrl)}>
                    <img alt="아프리카" src="/images/logo/afreecaLogo.png" className={classes.logo} />
                    {afreecaUrl}
                  </Typography>
                  )}
                </Grid>
                <Grid item>
                  <VoteButton
                    type="up"
                    value={stream.likeCount}
                    size={theme.spacing(6)}
                    isVoted={stream?.voteHistory?.type}
                    onClick={() => onUpVote()}
                    onCancel={() => {
                      if (stream?.voteHistory && stream?.voteHistory.type === 'up') onVoteCancel(stream?.voteHistory.id);
                    }}
                  />
                  <VoteButton
                    type="down"
                    value={stream.hateCount}
                    size={theme.spacing(6)}
                    isVoted={stream?.voteHistory?.type}
                    onClick={() => onDownVote()}
                    onCancel={() => {
                      if (stream?.voteHistory && stream?.voteHistory.type === 'down') onVoteCancel(stream?.voteHistory.id);
                    }}
                  />
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
    </Grid>
  );
}
