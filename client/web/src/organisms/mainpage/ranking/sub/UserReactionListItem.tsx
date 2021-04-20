import {
  ListItem, Avatar, ListItemAvatar, ListItemText, Typography,
} from '@material-ui/core';
import React, { memo, useCallback } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import dayjs from 'dayjs';
import { UserReaction as IUserReaction } from '@truepoint/shared/dist/interfaces/UserReaction.interface';
import DeleteButton from './DeleteButton';

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

function UserReactionListItem({ data }: {data: IUserReaction}): JSX.Element {
  const classes = useUserReactionListItemStyle();
  const {
    username, content, ip, id,
  } = data;
  const date = dayjs(data.createDate).format('hh:mm A');

  const onDeleteButtonClick = useCallback(() => {
    console.log(`open password confirm popup of reaction id ${id}`);
  }, []);
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
            <div>
              <Typography variant="caption" component="span">{date}</Typography>
              <DeleteButton onClick={onDeleteButtonClick} />
            </div>

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
