import React from 'react';
import { useParams } from 'react-router-dom';
import useScrollTop from '../../utils/hooks/useScrollTop';
import VideoAnalysisReport from './VideoAnalysisReport';
import VideoAnalysisReaction from './VideoAnalysisReaction';
import VideoAnalysisComments from './VideoAnalysisComments';

interface ParamTypes{
  id: string
}

export default function VideoAnalysis(): JSX.Element {
  useScrollTop();
  const { id } = useParams<ParamTypes>();
  return (
    <div>
      <div>
        video id :
        {id}
      </div>
      <VideoAnalysisReport />
      <VideoAnalysisReaction />
      <VideoAnalysisComments />
    </div>
  );
}
