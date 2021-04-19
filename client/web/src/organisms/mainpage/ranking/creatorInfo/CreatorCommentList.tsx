import {
  Button, Typography,
} from '@material-ui/core';
import useAxios from 'axios-hooks';
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import classnames from 'classnames';
import {
  ICreatorCommentsRes, ICreatorCommentData, IGetLikes, IGetHates,
} from '@truepoint/shared/dist/res/CreatorCommentResType.interface';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import CreatorCommentItem from './CreatorCommentItem';
import { useCreatorCommentListStyle } from '../style/CreatorComment.style';
import RegularButton from '../../../../atoms/Button/Button';
import CommentForm from '../sub/CommentForm';

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

const filters = ['recommend', 'date'];

export default function CreatorCommentList(props: CreatorCommentListProps): JSX.Element {
  const listStyle = useCreatorCommentListStyle();
  const classes = useStyles();
  const { creatorId } = props;
  const [commentList, setCommentList] = useState<ICreatorCommentData[]>([]);
  const [clickedFilterButtonIndex, setClickedFilterButtonIndex] = useState<number>(0); //  0 : 인기순(recommend), 1 : 최신순(date)
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

  const loadMoreComments = useCallback(() => {
    getCommentData({
      params: {
        skip: commentList.length,
        order: filters[clickedFilterButtonIndex],
      },
    }).then((res) => {
      setCommentList((prevList) => [...prevList, ...res.data.comments]);
    }).catch((error) => {
      console.error(error);
    });
  }, [clickedFilterButtonIndex, commentList.length, getCommentData]);

  useEffect(() => {
    loadComments('recommend');
  // 한번만 실행
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitSuccessCallback = () => {
    loadComments(clickedFilterButtonIndex === 1 ? 'date' : 'recommend');
  };

  const handleRecommendFilter = useCallback(() => {
    setClickedFilterButtonIndex(0);
    loadComments('recommend');
  }, [loadComments]);

  const handleDateFilter = useCallback(() => {
    setClickedFilterButtonIndex(1);
    loadComments('date');
  }, [loadComments]);

  return (
    <div className={classes.commentSectionWrapper}>
      <CommentForm
        postUrl={`/creatorComment/${creatorId}`}
        submitSuccessCallback={submitSuccessCallback}
      />

      <div className={listStyle.commentsContainer}>
        <div className={listStyle.commentFilterContainer}>
          <Button
            startIcon={<CheckIcon />}
            className={classnames(listStyle.commentFilterButton, { selected: clickedFilterButtonIndex === 0 })}
            onClick={handleRecommendFilter}
          >
            인기순
          </Button>
          <Button
            startIcon={<CheckIcon />}
            className={classnames(listStyle.commentFilterButton, { selected: clickedFilterButtonIndex === 1 })}
            onClick={handleDateFilter}
          >
            최신순
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
