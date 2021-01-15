import React, {
  useState, useEffect, useMemo,
} from 'react';
import axios from 'axios';
import moment from 'moment';
import ChannelAnalysisSectionLayout from './ChannelAnalysisSectionLayout';
import VideoAnalysisReactionToggleButtons from './VideoAnalysisReactionToggleButtons';
import VideoAnalysisReactionTable from './VideoAnalysisReactionTable';

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

export default function VideoAnalysisReaction(): JSX.Element {
  const [comments, setComments] = useState<fakeCommentType[]|null>(null);
  const [url, setUrl] = useState('/mostPopularComments');
  const [loading, setLoading] = useState(false);

  const getComments = async (commentUrl: string) => {
    try {
      setLoading(true);
      const response = await axios.get(fakeBaseURl + commentUrl);
      setComments(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setUrl('/mostPopularComments');
  }, []);

  useEffect(() => {
    getComments(url);
  }, [url]);

  const commentsData = useMemo(() => (
    comments
      ? comments.map((comment) => (
        {
          id: comment.commentId,
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
      description="반응분석~~~"
    >

      <VideoAnalysisReactionToggleButtons
        url={url}
        setUrl={setUrl}
      />

      <VideoAnalysisReactionTable
        commentsData={commentsData}
        loading={loading}
      />

    </ChannelAnalysisSectionLayout>
  );
}
