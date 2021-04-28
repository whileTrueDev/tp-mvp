import React, { useCallback, useRef, memo } from 'react';
import { Button, Grid } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import useAxios from 'axios-hooks';
import { CreateReplyDto } from '@truepoint/shared/dist/dto/communityBoard/createReply.dto';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';
import InputField from '../write/InputField';

type ReplyContentType = Omit<CreateReplyDto, 'postId'>;

const errorMessasges: ReplyContentType = {
  nickname: '닉네임을 입력해주세요. 최대 12자까지 가능합니다',
  password: '비밀번호를 입력해주세요. 최대 4자까지 가능합니다',
  content: '댓글 내용을 입력해주세요. 최대 100자까지 가능합니다',
};
function ReplyForm({
  postId,
  afterCreateReplyHandler,
}: {
  postId: string,
  afterCreateReplyHandler?: () => void,
}): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const nicknameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [, postCreatReply] = useAxios({ url: `/community/${postId}/replies`, method: 'post' }, { manual: true });

  // 댓글생성dto가 비어있는지 확인 && axios요청하는 함수
  const doPostReply = useCallback(() => {
    const replyContent: ReplyContentType = {
      nickname: nicknameRef.current ? nicknameRef.current.value.trim() : '',
      password: passwordRef.current ? passwordRef.current.value.trim() : '',
      content: contentRef.current ? contentRef.current.value.trim() : '',
    };

    try {
      // nickname, password, content 값이 비어있으면 에러 -> 스낵바
      const keys = Object.keys(replyContent) as Array<keyof ReplyContentType>;
      keys.forEach((key: keyof ReplyContentType) => {
        const value = replyContent[key];
        if (value === '') {
          throw new Error(errorMessasges[key]);
        }
      });

      // 값이 다 있다면 댓글생성 요청
      const createReplyDto: CreateReplyDto = {
        ...replyContent,
        // postId: Number(postId),
      };
      postCreatReply({
        data: createReplyDto,
      }).then((res) => {
        // 댓글생성 후 인풋창 비우기
        if (nicknameRef.current && passwordRef.current && contentRef.current) {
          nicknameRef.current.value = '';
          passwordRef.current.value = '';
          contentRef.current.value = '';
        }
        // 댓글 다시 불러오기
        if (afterCreateReplyHandler) {
          afterCreateReplyHandler();
        }
      }).catch((e) => {
        console.error(e);
        ShowSnack('댓글 생성중 오류가 발생했습니다. 잠시 후 다시 시도해주세요', 'error', enqueueSnackbar);
      });
    } catch (e) {
      ShowSnack(e.message, 'error', enqueueSnackbar);
    }
  }, [afterCreateReplyHandler, enqueueSnackbar, postCreatReply, postId]);

  return (
    <div>
      <Grid container wrap="wrap" spacing={1}>
        <Grid item xs={12} sm={3}>
          <InputField inputRef={nicknameRef} maxLength={12} placeholder="닉네임" />
          <InputField inputRef={passwordRef} maxLength={4} placeholder="비밀번호" type="password" />
        </Grid>
        <Grid item xs={12} sm={8}>
          <InputField inputRef={contentRef} multiline rows={4} maxLength={100} />
        </Grid>
        <Grid item xs={12} sm={1}>
          <Button fullWidth variant="contained" color="primary" onClick={doPostReply}>댓글 등록</Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default memo(ReplyForm);
