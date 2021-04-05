import { Button, TextField } from '@material-ui/core';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { CreateCommentDto } from '@truepoint/shared/dist/dto/creatorComment/createComment.dto';
import useAuthContext from '../../../../utils/hooks/useAuthContext';
import CreatorCommentItem from './CreatorCommentItem';
import { useCreatorCommentFormStyle, useCreatorCommentListStyle } from '../style/CreatorComment.style';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';
import RegularButton from '../../../../atoms/Button/Button';
import axios from '../../../../utils/axios';

interface creatorCommentData {
  commentId: number;
  /** 코멘트가 달린 크리에이터 아이디 */
  creatorId: string;
  /** 코멘트 작성한 유저의 아이디 */
  userId?: string | null;
  /** 코멘트 작성한 유저가 입력한 닉네임 */
  nickname: string;
  content: string;
  createDate: Date;
  /** 코멘트 좋아요 횟수 */
  likesCount: number;
  /** 코멘트 싫어요 횟수 */
  hatesCount: number;
}
export interface CreatorCommentListProps{
//  data: creatorCommentData[]
  creatorId: string;
}

export default function CreatorCommentList(props: CreatorCommentListProps): JSX.Element {
  const authContext = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const formStyle = useCreatorCommentFormStyle();
  const listStyle = useCreatorCommentListStyle();
  const { creatorId } = props;
  const [commentList, setCommentList] = useState<creatorCommentData[]>([]);
  const [{ data: commentData, loading }, getCommentData] = useAxios<{comments: creatorCommentData[], count: number}>({
    url: `/creatorComment/${creatorId}`,
    method: 'get',
    params: {
      skip: 0,
      order: 'date',
    },
  });
  const [{ data: likeList }] = useAxios<{userIp: string, likes: number[]}>('/creatorComment/like-list');
  const [{ data: hateList }] = useAxios<{userIp: string, hates: number[]}>('/creatorComment/hate-list');
  const likes = useMemo(() => (likeList ? likeList.likes : []), [likeList]);
  const hates = useMemo(() => (hateList ? hateList.hates : []), [hateList]);

  const loadComments = useCallback(() => {
    getCommentData().then((res) => {
      setCommentList(res.data.comments);
    }).catch((error) => {
      console.error(error);
    });
  }, [getCommentData]);

  const loadMoreComments = useCallback(() => {
    getCommentData({
      params: {
        skip: commentList.length,
        order: 'date',
      },
    }).then((res) => {
      setCommentList((prevList) => [...prevList, ...res.data.comments]);
    }).catch((error) => {
      console.error(error);
    });
  }, [commentList.length, getCommentData]);

  useEffect(() => {
    loadComments();
  // 한번만 실행
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const nicknameInput = form.nickname;
    const passwordInput = form.password;
    const contentInput = form.content;
    const nickname = e.currentTarget.nickname.value.trim();
    const password = e.currentTarget.password.value.trim();
    const content = e.currentTarget.content.value.trim();
    if (!nickname || !password || !content) {
      ShowSnack('닉네임, 비밀번호, 내용을 입력해주세요', 'error', enqueueSnackbar);
    }

    const createCommentDto: CreateCommentDto = {
      userId: authContext.user.userId ? authContext.user.userId : null,
      nickname,
      password,
      content,
    };
    axios.post(`/creatorComment/${creatorId}`, { ...createCommentDto })
      .then((res) => {
        nicknameInput.value = '';
        passwordInput.value = '';
        contentInput.value = '';
        loadComments();
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <form className={formStyle.form} onSubmit={onSubmit}>
        <div className={formStyle.inputWrapper}>
          <div>
            <TextField label="닉네임" name="nickname" variant="outlined" placeholder="닉네임" inputProps={{ maxLength: 8 }} className={formStyle.nicknameInput} />
            {authContext.user.userId
              ? null
              : <TextField label="비밀번호" name="password" type="password" placeholder="비밀번호" variant="outlined" inputProps={{ maxLength: 4 }} />}
          </div>

          <TextField
            fullWidth
            multiline
            rows={3}
            name="content"
            placeholder="이 크리에이터에 관한 댓글을 남겨주세요"
          />
        </div>

        <Button type="submit" className={formStyle.button}>입력</Button>
      </form>

      {commentList.map((d) => (
        <CreatorCommentItem
          key={d.commentId}
          {...d}
          isLiked={likes.includes(d.commentId)}
          isHated={hates.includes(d.commentId)}
        />
      ))}

      <div className={listStyle.buttonWrapper}>
        {commentData
        && (commentData.count > commentList.length)
        && <RegularButton onClick={loadMoreComments} load={loading}>더보기</RegularButton>}
      </div>

    </div>
  );
}
