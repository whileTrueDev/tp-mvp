import { makeStyles, Tooltip } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { Comment } from '@material-ui/icons';
import { UserDetail } from '@truepoint/shared/dist/interfaces/UserDetail.interface';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  clickable: {
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  icon: {
    verticalAlign: 'middle',
  },
  success: {
    color: theme.palette.success.main,
  },
}));

interface CreatorListItemProps {
  handleSelect: React.MouseEventHandler<HTMLSpanElement>;
  userId: string;
  nickName: string;
  twitchId?: string;
  afreecaId?: string;
  youtubeId?: string;
  detail?: UserDetail
}

export default function CreatorListItem({
  handleSelect,
  userId,
  nickName,
  twitchId,
  afreecaId,
  youtubeId,
  detail,
}: CreatorListItemProps): React.ReactElement {
  const classes = useStyles();
  return (
    <Typography className={classes.clickable} color="primary" onClick={handleSelect}>
      <span>
        {twitchId ? (<img style={{ marginRight: 4 }} alt="twitch" width={20} height={20} src="/logos/twitchLogo.png" />) : (null)}
        {afreecaId ? (<img style={{ marginRight: 4 }} alt="afreeca" width={20} height={20} src="/logos/afreecaLogo.png" />) : (null)}
        {youtubeId ? (<img style={{ marginRight: 4 }} alt="youtube" width={20} height={20} src="/logos/youtubeLogo.png" />) : (null)}
      </span>
      <span>
        {detail?.description && (
        <Tooltip title="상세 설명 있음">
          <Comment color="secondary" fontSize="small" className={classes.icon} />
        </Tooltip>
        )}
      </span>
      {`${userId} / ${nickName}`}
    </Typography>
  );
}
