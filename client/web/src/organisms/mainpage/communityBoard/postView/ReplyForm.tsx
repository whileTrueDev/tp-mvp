import React, { useCallback, useRef } from 'react';
import { Button, Grid } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import InputField from '../write/InputField';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';

const useStyles = makeStyles((theme: Theme) => createStyles({
  contentInput: {
    height: '100%',
  },
}));

interface ReplyContentType {
  nickname: string;
  password: string;
  content: string;
}
const errorMessasges: ReplyContentType = {
  nickname: '닉네임을 입력해주세요. 최대 12자까지 가능합니다',
  password: '비밀번호를 입력해주세요. 최대 4자까지 가능합니다',
  content: '댓글 내용을 입력해주세요. 최대 100자까지 가능합니다',
};
export default function ReplyForm(): JSX.Element {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const nicknameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const onClick = useCallback(() => {
    const createReplyDto: ReplyContentType = {
      nickname: nicknameRef.current ? nicknameRef.current.value.trim() : '',
      password: passwordRef.current ? passwordRef.current.value.trim() : '',
      content: contentRef.current ? contentRef.current.value.trim() : '',
    };

    try {
      const keys = Object.keys(createReplyDto) as Array<keyof ReplyContentType>;
      keys.forEach((key: keyof ReplyContentType) => {
        const value = createReplyDto[key];
        if (value === '') {
          throw new Error(errorMessasges[key]);
        }
      });
    } catch (e) {
      ShowSnack(e.message, 'error', enqueueSnackbar);
    }
  }, []);
  return (
    <div>
      <Grid container wrap="wrap" spacing={1}>
        <Grid item xs={12} sm={3}>
          <InputField inputRef={nicknameRef} maxLength={12} placeholder="닉네임" />
          <InputField inputRef={passwordRef} maxLength={4} placeholder="비밀번호" type="password" />
        </Grid>
        <Grid item xs={12} sm={8}>
          <InputField inputRef={contentRef} multiline rows={4} maxLength={100} className={classes.contentInput} placeholder="댓글 내용을 입력하세요" />
        </Grid>
        <Grid item xs={12} sm={1}>
          <Button fullWidth variant="contained" color="primary" onClick={onClick}>등록</Button>
        </Grid>

      </Grid>

    </div>
  );
}
