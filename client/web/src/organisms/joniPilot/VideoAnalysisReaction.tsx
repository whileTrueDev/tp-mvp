import React, {
  useState, useEffect, useMemo,
} from 'react';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
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

// 버튼 데이터
const fakeBaseURl = 'http://localhost:4000';
const buttonData = [
  {
    label: '가장 인기 많은 댓글',
    url: '/mostPopularComments',
  },
  {
    label: '가장 인기 많은 대댓글',
    url: '/mostPopularReplies',
  },
  {
    label: '웃음이 많은 댓글',
    url: '/mostSmiledComments',
  },
  {
    label: '피드백 댓글',
    url: '/feedbackComments',
  },
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
    textAlign: 'center' as const,
  },
};
// 댓글 테이블 컬럼데이터
const commentTableColumns = [
  { field: 'date', title: '날짜' },
  { field: 'commentInfo', title: '' },
  { field: 'likes', title: '좋아요' },
  { field: 'hates', title: '싫어요' },
  { field: 'replies', title: '대댓글' },
];

export default function VideoAnalysisReaction(): JSX.Element {
  const [comments, setComments] = useState<fakeCommentType[]|null>(null);
  const [url, setUrl] = useState(buttonData[0].url);

  useEffect(() => {
    getComments(buttonData[0].url);
  }, []);

  const getComments = async (commentUrl: string) => {
    try {
      const response = await axios.get(fakeBaseURl + commentUrl);
      setComments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleButton = (event: React.MouseEvent<HTMLElement>, newUrl: string) => {
    setUrl(newUrl);
    getComments(newUrl);
  };

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

  return (
    <ChannelAnalysisSectionLayout
      title="반응 분석"
      tooltip="반응분석~~~"
    >
      <ToggleButtonGroup
        value={url}
        exclusive
        onChange={handleButton}
      >
        {buttonData.map((button) => (
          <ToggleButton value={button.url}>{button.label}</ToggleButton>
        ))}
      </ToggleButtonGroup>

      <MaterialTable
        columns={commentTableColumns}
        data={commentsData}
        options={commentTableOptions}
      />
    </ChannelAnalysisSectionLayout>
  );
}
