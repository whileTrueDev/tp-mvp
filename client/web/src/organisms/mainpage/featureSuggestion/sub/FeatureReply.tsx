import React from 'react';
import moment from 'moment';
import { Avatar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: { width: '100%', marginTop: theme.spacing(3) },
  wrapper: { display: 'flex' },
  avatar: { marginRight: theme.spacing(2) },
  titleSection: { display: 'flex', alignItems: 'center' },
  title: { fontWeight: 'bold' },
}));
export interface FeatureReplyProps {
  author: string;
  content: string;
  createdAt: string | Date;
  avatarLogo?: string;
}
export default function FeatureReply({
  avatarLogo = '/images/logo/logo_truepoint.png', author, createdAt, content,
}: FeatureReplyProps): JSX.Element {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <Avatar src={avatarLogo} variant="square" className={classes.avatar} />
        <div>
          <div className={classes.titleSection}>
            <Typography variant="body2" className={classes.title}>{author}</Typography>
            &emsp;
            <Typography variant="caption">{moment(createdAt).fromNow()}</Typography>
          </div>
          {content.split('\n').map((text) => (
            <Typography key={text}>{text}</Typography>
          ))}
        </div>
      </div>
    </div>
  );
}
