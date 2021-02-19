import React, { memo } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Card, CardContent, Chip, Divider, Grid, Typography,
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
  post: CommunityPost
}
function PostInfoCard({ post }: PostProps) {
  const {
    title, nickname, ip, createDate, hit, recommend, replies,
  } = post;

  const cardClass = usePostInfoCardStyle();

  function handleChipClick() {
    console.log('move to ref element');
  }
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
              label={`댓글 ${replies ? replies.length : 0}`}
              onClick={handleChipClick}
            />
          </div>
        </Grid>
      </Grid>

    </Card>
  );
}

export default memo(PostInfoCard);
