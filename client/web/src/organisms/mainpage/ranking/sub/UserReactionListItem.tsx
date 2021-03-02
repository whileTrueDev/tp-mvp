import {
  ListItem, Avatar, ListItemAvatar, ListItemText, Typography,
} from '@material-ui/core';
import React, { memo } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import * as datefns from 'date-fns';
import transformIdToAsterisk from '../../../../utils/transformAsterisk';
import { UserReactionData } from '../UserReaction';

const useUserReactionListItemStyle = makeStyles((theme: Theme) => createStyles({
  itemPrimaryText: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
    color: theme.palette.grey.A700,
    '&>span': {
      color: theme.palette.grey[600],
    },
  },
  itemContent: {
    lineBreak: 'anywhere',
    whiteSpace: 'pre-line',
  },
}));

function UserReactionListItem({ data }: {data: UserReactionData}): JSX.Element {
  const classes = useUserReactionListItemStyle();
  const { username, content } = data;
  const ip = transformIdToAsterisk(data.ip, 2);
  const date = datefns.format(new Date(data.createDate), 'hh:MM aaaaa\'m\'');
  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar />
      </ListItemAvatar>
      <ListItemText
        classes={{ primary: classes.itemPrimaryText }}
        primary={(
          <>
            <Typography>{`${username} (${ip})`}</Typography>
            <Typography variant="caption" component="span">{date}</Typography>
          </>
    )}
        secondary={
          <Typography className={classes.itemContent}>{content}</Typography>
    }
      />
    </ListItem>
  );
}

export default memo(UserReactionListItem);
