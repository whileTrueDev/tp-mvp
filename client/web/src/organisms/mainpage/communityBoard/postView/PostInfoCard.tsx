import React, { memo } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Card, Chip, Divider, Grid, Typography,
} from '@material-ui/core';
import { CommunityPost } from '@truepoint/shared/dist/interfaces/CommunityPost.interface';
import useMediaSize from '../../../../utils/hooks/useMediaSize';

const usePostInfoCardStyle = makeStyles((theme: Theme) => createStyles({
  postInfoCard: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(0.5),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1, 0),
    },
  },
  title: {
    padding: theme.spacing(0, 2),
    marginBottom: theme.spacing(1),
    fontSize: theme.typography.h5.fontSize,
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(1.5),
    },
  },
  group: {
    width: 'fit-content',
    display: 'flex',
    alignItems: 'center',
    '&>.text': {
      padding: theme.spacing(0, 2),
      [theme.breakpoints.down('sm')]: {
        fontSize: theme.spacing(1.25),
      },
    },
  },
  repliesChip: {
    '&>.MuiChip-label': {
      fontSize: '1rem', // 다른 글자들과 크기 맞춤
      [theme.breakpoints.down('sm')]: {
        fontSize: theme.spacing(1.25),
      },
    },
  },

}));

interface PostProps {
  post: CommunityPost,
  repliesCount?: number
}
function PostInfoCard({ post, repliesCount }: PostProps) {
  const {
    title, nickname, createDate, hit, recommend,
  } = post;

  const { isMobile } = useMediaSize();
  const cardClass = usePostInfoCardStyle();

  return (

    <Card className={cardClass.postInfoCard}>
      <Typography variant="h5" className={cardClass.title}>{title}</Typography>
      <Grid container justify="space-between">
        <Grid item className={cardClass.group} xs={12} sm={6}>
          <Typography className="text">{`${nickname}`}</Typography>
          <Divider orientation="vertical" flexItem />
          <Typography className="text">{createDate ? new Date(createDate).toLocaleString() : ''}</Typography>
        </Grid>
        <Grid item className={cardClass.group} xs={12} sm={6} container justify="flex-end">
          <Typography className="text">{`조회 ${hit}`}</Typography>
          <Divider orientation="vertical" flexItem />
          <Typography className="text">{`추천 ${recommend}`}</Typography>
          <Divider orientation="vertical" flexItem />
          <div className="text">
            <Chip
              size={isMobile ? 'small' : undefined}
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
