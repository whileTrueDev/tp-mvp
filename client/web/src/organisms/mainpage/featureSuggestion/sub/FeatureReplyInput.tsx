import {
  Avatar, Button, TextField, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ReplyPost } from '@truepoint/shared/dist/dto/featureSuggestion/replyPost.dto';
import { FeatureSuggestion } from '@truepoint/shared/dist/interfaces/FeatureSuggestion.interface';
import { FeatureSuggestionReply } from '@truepoint/shared/dist/interfaces/FeatureSuggestionReply.interface';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import React, { useRef } from 'react';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';
import useAuthContext from '../../../../utils/hooks/useAuthContext';
import useDialog from '../../../../utils/hooks/useDialog';
import CheckPasswordDialog from '../../shared/CheckPasswordDialog';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    display: 'flex',
    width: '100%',
    alignItems: 'flex-start',
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
  const { enqueueSnackbar } = useSnackbar();
  const { currentSuggestion, refetch, avatarLogo } = props;
  const auth = useAuthContext();

  const [lengthState, setLengthState] = React.useState(false);
  const lengthCheck = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.value.length === 255) {
      setLengthState(true);
    } else {
      setLengthState(false);
    }
  };
  // 기능제안 댓글 작성을 위한 input text ref
  const replyText = useRef<HTMLInputElement>(null);

  // 댓글 작성 요청
  const [, postReply] = useAxios<FeatureSuggestionReply>({
    method: 'POST',
    url: '/feature-suggestion/reply',
  }, { manual: true });

  // "댓글 작성" 핸들러
  function handleReplySubmit() {
    if (replyText.current) {
      if (!replyText.current.value.trim()) {
        ShowSnack('댓글을 올바르게 입력해주세요.', 'error', enqueueSnackbar);
      } else {
        const data: ReplyPost = {
          suggestionId: currentSuggestion.suggestionId,
          author: auth.user.userId,
          content: replyText.current.value,
        };
        postReply({ data })
          .then(() => refetch())
          .catch(() => ShowSnack('댓글 작성중 오류가 발생했습니다. 문의부탁드립니다.', 'error', enqueueSnackbar));
      }
    }
  }

  // 기능제안 글의 비밀번호 확인 요청
  const [, checkPassword] = useAxios({
    url: `/feature-suggestion/${currentSuggestion.suggestionId}/password`, method: 'POST',
  }, { manual: true });

  // 비밀번호 확인 다이얼로그
  const confirmDialog = useDialog();

  return (
    <div className={classes.container}>
      <Avatar src={avatarLogo} variant="square" className={classes.avatar} />
      <TextField
        error={lengthState}
        placeholder="댓글 추가..."
        fullWidth
        multiline
        rowsMax={5}
        inputRef={replyText}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          lengthCheck(e);
        }}
        inputProps={{ maxLength: 255 }}
        helperText="댓글은 최대 255자까지 작성 가능합니다."
      />
      <Button
        className={classes.button}
        color="primary"
        variant="contained"
        onClick={() => {
          if (replyText.current && replyText.current.value.trim()) confirmDialog.handleOpen();
          else ShowSnack('댓글을 입력해주세요.', 'error', enqueueSnackbar);
        }}
      >
        댓글 작성
      </Button>

      <CheckPasswordDialog
        open={confirmDialog.open}
        onClose={confirmDialog.handleClose}
        checkPassword={checkPassword}
        successHandler={() => {
          handleReplySubmit();
          confirmDialog.handleClose();
        }}
      >
        <Typography>글의 비밀번호를 입력해주세요.</Typography>
      </CheckPasswordDialog>

    </div>
  );
}
