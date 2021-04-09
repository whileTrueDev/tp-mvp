import React from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import { PostFound } from '@truepoint/shared/dist/res/FindPostResType.interface';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useHotPostItemStyles = makeStyles((theme: Theme) => createStyles({
  button: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
    padding: theme.spacing(2),
    '&:not(:last-child)': {
      marginBottom: theme.spacing(0.5),
    },
  },
  nickname: {
    textOverflow: 'ellipsis',
  },
  titleWrapper: {
    flexWrap: 'nowrap',
  },
  title: {
    textOverflow: 'ellipsis',
    marginLeft: theme.spacing(1),
  },
}));

export interface HotPostItemProps {
 icon?: JSX.Element | React.ReactNode,
 post: PostFound,
 onClick?: () => void
}

export default function HotPostItem(props: HotPostItemProps): JSX.Element {
  const {
    icon, post, onClick,
  } = props;
  const classes = useHotPostItemStyles();

  const { title, nickname } = post;

  return (
    <Button onClick={onClick} fullWidth className={classes.button}>
      <Grid container spacing={2}>
        <Grid item xs={8} container alignItems="center" className={classes.titleWrapper}>
          {icon}
          <Typography className={classes.title} noWrap>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={4} container alignItems="center" justify="flex-end">
          <Typography className={classes.nickname} noWrap align="right">
            {nickname}
          </Typography>
        </Grid>
      </Grid>

    </Button>
  );
}
