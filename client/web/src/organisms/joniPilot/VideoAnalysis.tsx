import React from 'react';
import { StaticContext } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';
import useScrollTop from '../../utils/hooks/useScrollTop';
import VideoAnalysisReport from './VideoAnalysisReport';
import VideoAnalysisReaction from './VideoAnalysisReaction';
import VideoAnalysisComments from './VideoAnalysisComments';

export interface fakeVideoItemType{
  streamId: string,
  title: string,
  platform: 'afreeca' | 'youtube' | 'twitch',
  startDate: Date,
  endDate: Date,
  creatorId: string,
  smileCount: number,
  viewer: number,
  chatCount: number,
  needAnalysis: boolean,
  thumbnail: string,
  views: number,
  likes: number,
  hates: number,
  rating: number,
  tags: string[],
  comments: number,
}
interface ParamTypes{
  id: string,
}
interface StateType{
  data: fakeVideoItemType
}
export default function VideoAnalysis(
  { match, location }: RouteComponentProps<ParamTypes, StaticContext, StateType>,
): JSX.Element {
  useScrollTop();
  const { data } = location.state;
  return (
    <div>
      <VideoAnalysisReport data={data} />
      <VideoAnalysisReaction />
      <VideoAnalysisComments />
    </div>
  );
}
