import React, { memo } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Card, Chip, Divider, Grid, Typography,
} from '@material-ui/core';
import { CommunityPost } from '@truepoint/shared/dist/interfaces/CommunityPost.interface';

const usePostInfoCardStyle = makeStyles((theme: Theme) => createStyles({
  postInfoCard: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(0.5),
  },
  title: {
    padding: theme.spacing(0, 2),
    marginBottom: theme.spacing(1),
  },
  group: {
    width: 'fit-content',
    display: 'flex',
    alignItems: 'center',
    '&>.text': {
      padding: theme.spacing(0, 2),
    },
  },
  repliesChip: {
    '&>.MuiChip-label': {
      fontSize: '1rem', // 다른 글자들과 크기 맞춤
    },
  },

}));

interface PostProps {
  post: CommunityPost,
  repliesCount?: number
}
function PostInfoCard({ post, repliesCount }: PostProps) {
  const {
    title, nickname, ip, createDate, hit, recommend,
  } = post;

  const cardClass = usePostInfoCardStyle();

  return (

    <Card className={cardClass.postInfoCard}>
      <Typography variant="h5" className={cardClass.title}>{title}</Typography>
      <Grid container justify="space-between">
        <Grid item className={cardClass.group}>
          <Typography className="text">{`${nickname} (${ip})`}</Typography>
          <Divider orientation="vertical" flexItem />
          <Typography className="text">{createDate ? new Date(createDate).toLocaleString() : ''}</Typography>
        </Grid>
        <Grid item className={cardClass.group}>
          <Typography className="text">{`조회 ${hit}`}</Typography>
          <Divider orientation="vertical" flexItem />
          <Typography className="text">{`추천 ${recommend}`}</Typography>
          <Divider orientation="vertical" flexItem />
          <div className="text">
            <Chip
              className={cardClass.repliesChip}
              label={`댓글 ${repliesCount || 0}`}
            />
          </div>
        </Grid>
      </Grid>
    </Card>
  );
}

export default memo(PostInfoCard);
