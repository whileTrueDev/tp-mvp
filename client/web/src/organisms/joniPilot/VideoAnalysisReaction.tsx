import React, {
  useState, useEffect, useMemo, useCallback,
} from 'react';
import { Button, Grid } from '@material-ui/core';
import axios from 'axios';

import MaterialTable from '../../atoms/Table/MaterialTable';
import ChannelAnalysisSectionLayout from './ChannelAnalysisSectionLayout';

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
const url = {
  mostPopular: 'http://localhost:4000/mostPopularComments?_sort=likes&_order=desc',
  mostPopularReplies: 'http://localhost:4000/mostPopularReplies?_sort=likes&_order=desc',
  mostSmiledComments: 'http://localhost:4000/mostSmiledComments?_sort=likes&_order=desc',
  feedbackComments: 'http://localhost:4000/feedbackComments?_sort=replies&_order=desc',
};
const commentTableOptions = {
  toolbar: false,
  showFirstLastPageButtons: false,
  search: false,
  showTitle: false,
  draggable: false,
  sorting: false,
  paging: false,
  headerStyle: {
    textAlign: 'center' as const,
  },
};

export default function VideoAnalysisReaction(): JSX.Element {
  const [comments, setComments] = useState<fakeCommentType[]|null>(null);

  useEffect(() => {
    getComments(url.mostPopular)();
  }, []);

  const getComments = useCallback((commentUrl) => async () => {
    try {
      const response = await axios.get(commentUrl);
      setComments(response.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const buttonData = [
    {
      label: '가장 인기 많은 댓글',
      onClick: getComments(url.mostPopular),
    },
    {
      label: '가장 인기 많은 대댓글',
      onClick: getComments(url.mostPopularReplies),
    },
    {
      label: '웃음이 많은 댓글',
      onClick: getComments(url.mostSmiledComments),
    },
    {
      label: '피드백 댓글',
      onClick: getComments(url.feedbackComments),
    },
  ];

  const commentsData = useMemo(() => {
    if (comments) {
      return comments.map((comment) => (
        {
          date: comment.createdAt,
          commentInfo: comment.commentText,
          likes: comment.likes,
          hates: comment.hates,
          replies: comment.replies,
        }
      ));
    }
    return [];
  }, [comments]);

  const commentTableColumns = [
    { field: 'date', title: '날짜' },
    { field: 'commentInfo', title: '' },
    { field: 'likes', title: '좋아요' },
    { field: 'hates', title: '싫어요' },
    { field: 'replies', title: '대댓글' },
  ];
  return (
    <ChannelAnalysisSectionLayout
      title="반응 분석"
      tooltip="반응분석~~~"
    >
      <Grid container direction="row" justify="space-between">
        {buttonData.map((button) => (
          <Grid item>
            <Button
              variant="outlined"
              onClick={button.onClick}
            >
              {button.label}
            </Button>
          </Grid>
        ))}
      </Grid>
      <MaterialTable
        columns={commentTableColumns}
        data={commentsData}
        options={commentTableOptions}
      />
    </ChannelAnalysisSectionLayout>
  );
}
