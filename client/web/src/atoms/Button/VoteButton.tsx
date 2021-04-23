import { Box, Button, Typography } from '@material-ui/core';
import classnames from 'classnames';
import React from 'react';
import { useCreatorCommentItemStyle } from '../../organisms/mainpage/ranking/style/CreatorComment.style';

interface VoteButtonProps {
  type: 'up' | 'down';
  inline?: boolean;
  size?: number;
  value?: number;
  isVoted?: 'up' | 'down';
  onClick: () => void;
  onCancel: () => void;
}

export default function VoteButton({
  type,
  inline = true,
  size = 24,
  value = 0,
  isVoted,
  onClick,
  onCancel,
}: VoteButtonProps): React.ReactElement {
  const classes = useCreatorCommentItemStyle();

  function handleVoteClick() {
    if (isVoted && isVoted === type) onCancel();
    else onClick();
  }

  return (
    <Box
      display={inline ? 'inline-flex' : 'flex'}
      alignItems="center"
      fontWeight="fontWeightBold"
    >
      <Button
        className={classnames(classes.actionButton, {
          [classes.liked]: isVoted === type,
          [classes.hated]: isVoted === type,
        })}
        onClick={handleVoteClick}
        startIcon={<img src={`/images/rankingPage/thumb_${type}.png`} alt="추천" width={size} height={size} />}
      >
        <Typography color={isVoted === type ? 'primary' : 'textPrimary'}>
          {` ${value.toLocaleString()}`}
        </Typography>
      </Button>
    </Box>
  );
}
