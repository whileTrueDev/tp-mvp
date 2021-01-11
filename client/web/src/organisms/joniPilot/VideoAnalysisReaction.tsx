import React, {
  useState, useEffect, useMemo, memo, useCallback,
} from 'react';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Grid, Typography, Avatar } from '@material-ui/core';
import {
  makeStyles, createStyles, Theme, withStyles,
} from '@material-ui/core/styles';
import axios from 'axios';
import moment from 'moment';
import MaterialTable from '../../atoms/Table/MaterialTable';
import ChannelAnalysisSectionLayout from './ChannelAnalysisSectionLayout';
import VideoAnalysisReactionToggleButtons from './VideoAnalysisReactionToggleButtons';

interface fakeCommentType{
  commentId: string;
  commentText: string;
  streamId: string;
  createdAt: Date;
  userId: string;
  nickname: string;
  profileImage: string;
  likes: number;
  hates: number;
  replies: number;
}

// 버튼 데이터
const fakeBaseURl = 'https://joni-pilot.glitch.me';

// 댓글 테이블 내에 사용되는 컴포넌트 CommentInner
const useCommentInfoStyles = makeStyles((theme: Theme) => createStyles({
  avatar: {
    marginRight: theme.spacing(1),
  },
  nickname: {
    marginRight: theme.spacing(4),
  },
  commentText: {
    textAlign: 'start',
  },
}));

const CommentInner = memo((prop: Record<string, any>) => {
  const classes = useCommentInfoStyles();
  const { commentInfo } = prop;
  return (
    <>
      <Grid container>
        <Avatar className={classes.avatar} src={commentInfo.profileImage} alt={commentInfo.nickname} />
        <div>
          <Grid container>
            <Typography className={classes.nickname}>{commentInfo.nickname}</Typography>
            <Typography color="primary">{commentInfo.time}</Typography>
          </Grid>

          <Typography className={classes.commentText}>{commentInfo.commentText}</Typography>
        </div>
      </Grid>
    </>
  );
});

// 댓글 테이블 컬럼데이터
const commentTableColumns = [
  { field: 'date', title: '날짜', textAlign: 'center' },
  {
    field: 'commentInfo',
    title: '',
    textAlign: 'center',
    render: function CommentInfo(rowData: Record<string, any>) {
      const { commentInfo } = rowData;
      return (
        <CommentInner commentInfo={commentInfo} />
      );
    },
  },
  { field: 'likes', title: '좋아요', textAlign: 'center' },
  { field: 'hates', title: '싫어요', textAlign: 'center' },
  { field: 'replies', title: '대댓글', textAlign: 'center' },
];
// 댓글 테이블 옵션
const commentTableOptions = {
  toolbar: false,
  showFirstLastPageButtons: false,
  search: false,
  showTitle: false,
  draggable: false,
  sorting: false,
  paging: false,
  headerStyle: {
    backgroundColor: '#f5f6fa',
    color: '#a3a6b4',
    textAlign: 'center' as const,
  },
};

export default function VideoAnalysisReaction(): JSX.Element {
  const [comments, setComments] = useState<fakeCommentType[]|null>(null);
  const [url, setUrl] = useState('/mostPopularComments');

  useEffect(() => {
    getComments(url);
  }, []);

  const getComments = async (commentUrl: string) => {
    try {
      const response = await axios.get(fakeBaseURl + commentUrl);
      setComments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleButton = useCallback((event: React.MouseEvent<HTMLElement>, newUrl: string) => {
    setUrl(newUrl);
    getComments(newUrl);
  }, []);

  const commentsData = useMemo(() => (
    comments
      ? comments.map((comment) => (
        {
          date: moment(comment.createdAt).format('YYYY-MM-DD'),
          commentInfo: {
            profileImage: comment.profileImage,
            nickname: comment.nickname,
            time: moment(comment.createdAt).from(moment()),
            commentText: comment.commentText,
          },
          likes: `${comment.likes} 개`,
          hates: `${comment.hates} 개`,
          replies: `${comment.replies} 개`,
        }))
      : []
  ), [comments]);

  return (
    <ChannelAnalysisSectionLayout
      title="반응 분석"
      tooltip="반응분석~~~"
    >

      <VideoAnalysisReactionToggleButtons
        url={url}
        handleButton={handleButton}
      />

      <MaterialTable
        columns={commentTableColumns}
        data={commentsData}
        options={commentTableOptions}
      />
    </ChannelAnalysisSectionLayout>
  );
}
