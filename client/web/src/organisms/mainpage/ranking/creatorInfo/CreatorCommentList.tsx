import {
  Button, TextField, Typography,
} from '@material-ui/core';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import classnames from 'classnames';
import { CreateCommentDto } from '@truepoint/shared/dist/dto/creatorComment/createComment.dto';
import {
  ICreatorCommentsRes, ICreatorCommentData, IGetLikes, IGetHates,
} from '@truepoint/shared/dist/res/CreatorCommentResType.interface';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import useAuthContext from '../../../../utils/hooks/useAuthContext';
import CreatorCommentItem from './CreatorCommentItem';
import { useCreatorCommentFormStyle, useCreatorCommentListStyle } from '../style/CreatorComment.style';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';
import RegularButton from '../../../../atoms/Button/Button';
import axios from '../../../../utils/axios';

const useStyles = makeStyles((theme: Theme) => createStyles({
  commentSectionWrapper: {
    padding: theme.spacing(8),
    paddingBottom: theme.spacing(20),
    border: `${theme.spacing(0.5)}px solid ${theme.palette.common.black}`,
    backgroundImage: 'url(/images/rankingPage/streamer_detail_bg_2.svg), url(/images/rankingPage/streamer_detail_bg_3.svg)',
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundPosition: 'left center, left bottom',
    backgroundSize: '100% 100%, contain',
  },
}));

type CommentFilter = 'date' | 'recommend';
export interface CreatorCommentListProps{
  creatorId: string;
}

export default function CreatorCommentList(props: CreatorCommentListProps): JSX.Element {
  const authContext = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const formStyle = useCreatorCommentFormStyle();
  const listStyle = useCreatorCommentListStyle();
  const classes = useStyles();
  const { creatorId } = props;
  const [commentList, setCommentList] = useState<ICreatorCommentData[]>([]);
  const [clickedFilterButtonIndex, setClickedFilterButtonIndex] = useState<number>(0); // 0 : 최신순(date), 1 : 인기순(recommend)
  const [{ data: commentData, loading }, getCommentData] = useAxios<ICreatorCommentsRes>({
    url: `/creatorComment/${creatorId}`,
    method: 'get',
    params: {
      skip: 0,
      order: 'date',
    },
  });
  const [{ data: likeList }] = useAxios<IGetLikes>('/creatorComment/like-list');
  const [{ data: hateList }] = useAxios<IGetHates>('/creatorComment/hate-list');
  const likes = useMemo(() => (likeList ? likeList.likes : []), [likeList]);
  const hates = useMemo(() => (hateList ? hateList.hates : []), [hateList]);

  const loadComments = useCallback((filter: CommentFilter) => {
    getCommentData({
      params: {
        skip: 0,
        order: filter,
      },
    }).then((res) => {
      setCommentList(res.data.comments);
    }).catch((error) => {
      console.error(error);
    });
  }, [getCommentData]);

  const loadMoreComments = useCallback(() => (filter: CommentFilter) => {
    getCommentData({
      params: {
        skip: commentList.length,
        order: filter,
      },
    }).then((res) => {
      setCommentList((prevList) => [...prevList, ...res.data.comments]);
    }).catch((error) => {
      console.error(error);
    });
  }, [commentList.length, getCommentData]);

  useEffect(() => {
    // 최신순 댓글 목록 가져오기
    loadComments('date');
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
      return;
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
        loadComments(clickedFilterButtonIndex === 0 ? 'date' : 'recommend');
      })
      .catch((error) => console.error(error));
  };

  const handleDateFilter = useCallback(() => {
    setClickedFilterButtonIndex(0);
    loadComments('date');
  }, [loadComments]);

  const handleRecommendFilter = useCallback(() => {
    setClickedFilterButtonIndex(1);
    loadComments('recommend');
  }, [loadComments]);

  return (
    <div className={classes.commentSectionWrapper}>

      <form className={formStyle.form} onSubmit={onSubmit}>
        <div>
          <TextField label="닉네임" name="nickname" variant="outlined" placeholder="닉네임" inputProps={{ maxLength: 8 }} className={formStyle.nicknameInput} />
          {authContext.user.userId
            ? null
            : <TextField label="비밀번호" name="password" type="password" placeholder="비밀번호" variant="outlined" inputProps={{ maxLength: 4 }} />}
        </div>

        <TextField
          className={formStyle.contentTextArea}
          fullWidth
          multiline
          rows={4}
          inputProps={{ maxLength: 240 }}
          name="content"
          placeholder="내용을 입력해주세요"
        />
        <div className={formStyle.buttonWrapper}>
          <Button type="submit" className={formStyle.button}>등록</Button>
        </div>
      </form>

      <div className={listStyle.commentsContainer}>
        <div className={listStyle.commentFilterContainer}>
          <Button
            startIcon={<CheckIcon />}
            className={classnames(listStyle.commentFilterButton, { selected: clickedFilterButtonIndex === 0 })}
            onClick={handleDateFilter}
          >
            최신순
          </Button>
          <Button
            startIcon={<CheckIcon />}
            className={classnames(listStyle.commentFilterButton, { selected: clickedFilterButtonIndex === 1 })}
            onClick={handleRecommendFilter}
          >
            인기순
          </Button>
        </div>
        <div className={listStyle.commentListContainer}>
          {
          commentList.length
            ? commentList.map((d) => (
              <CreatorCommentItem
                key={d.commentId}
                {...d}
                isLiked={likes.includes(d.commentId)}
                isHated={hates.includes(d.commentId)}
              />
            ))
            : (
              <Typography className={listStyle.emptyList}>아직 댓글이 없어요! 첫 댓글을 남겨보세요.</Typography>
            )
        }
        </div>

      </div>

      <div className={listStyle.buttonWrapper}>
        {commentData
        && (commentData.count > commentList.length)
        && <RegularButton onClick={loadMoreComments} load={loading}>더보기</RegularButton>}
      </div>

    </div>
  );
}
