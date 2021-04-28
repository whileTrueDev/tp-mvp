import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  clickable: {
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

interface CreatorListItemProps {
  handleSelect: React.MouseEventHandler<HTMLSpanElement>;
  userId: string;
  nickName: string;
  twitchId?: string;
  afreecaId?: string;
  youtubeId?: string;
}

export default function CreatorListItem({
  handleSelect,
  userId,
  nickName,
  twitchId,
  afreecaId,
  youtubeId,
}: CreatorListItemProps): React.ReactElement {
  const classes = useStyles();
  return (
    <Typography className={classes.clickable} color="primary" onClick={handleSelect}>
      <span>
        {twitchId ? (<img style={{ marginRight: 4 }} alt="twitch" width={20} height={20} src="/logos/twitchLogo.png" />) : (null)}
        {afreecaId ? (<img style={{ marginRight: 4 }} alt="afreeca" width={20} height={20} src="/logos/afreecaLogo.png" />) : (null)}
        {youtubeId ? (<img style={{ marginRight: 4 }} alt="youtube" width={20} height={20} src="/logos/youtubeLogo.png" />) : (null)}
      </span>
      {`${userId} / ${nickName}`}
    </Typography>
  );
}
