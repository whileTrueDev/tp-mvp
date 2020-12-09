import React, { useRef } from 'react';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import {
  Avatar, TextField, Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FeatureSuggestion } from '@truepoint/shared/dist/interfaces/FeatureSuggestion.interface';
import { FeatureSuggestionReply } from '@truepoint/shared/dist/interfaces/FeatureSuggestionReply.interface';
import { ReplyPost } from '@truepoint/shared/dist/dto/featureSuggestion/replyPost.dto';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';
import useAuthContext from '../../../../utils/hooks/useAuthContext';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2), display: 'flex', alignItems: 'center', width: '100%',
  },
  avatar: { marginRight: theme.spacing(2) },
  button: { minWidth: 200, marginLeft: theme.spacing(2) },
}));

export interface FeatureReplyInputProps {
  currentSuggestion: Omit<FeatureSuggestion, 'content' | 'replies'>;
  refetch: () => void;
  avatarLogo?: string;
}
export default function FeatureReplyInput(props: FeatureReplyInputProps): JSX.Element {
  const classes = useStyles();
  const { currentSuggestion, refetch, avatarLogo } = props;
  const auth = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const [, postReply] = useAxios<FeatureSuggestionReply>({
    method: 'POST',
    url: '/feature-suggestion/reply',
  }, { manual: true });

  // 기능제안 댓글 작성을 위한 input text ref
  const replyText = useRef<HTMLInputElement>(null);

  // "댓글 작성" 버튼 핸들러
  function handleReplySubmit() {
    if (replyText.current) {
      if (replyText.current.value) {
        const data: ReplyPost = {
          suggestionId: currentSuggestion.suggestionId,
          author: auth.user.userId,
          content: replyText.current.value,
        };
        postReply({ data })
          .then(() => refetch())
          .catch(() => ShowSnack('댓글 작성중 오류가 발생했습니다. 문의부탁드립니다.', 'error', enqueueSnackbar));
      } else {
        ShowSnack('댓글을 올바르게 입력해주세요.', 'error', enqueueSnackbar);
      }
    }
  }

  return (
    <div className={classes.container}>
      <Avatar src={avatarLogo} variant="square" className={classes.avatar} />
      <TextField
        placeholder="댓글 추가..."
        fullWidth
        multiline
        rowsMax={5}
        inputRef={replyText}
      />
      <Button
        className={classes.button}
        color="primary"
        variant="contained"
        onClick={handleReplySubmit}
      >
        댓글 작성
      </Button>
    </div>
  );
}
