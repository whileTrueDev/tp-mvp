import React from 'react';
import ChannelAnalysisSectionLayout from './ChannelAnalysisSectionLayout';
import WordCloud from '../shared/WordCloud';

export default function VideoAnalysisComments(): JSX.Element {
  return (

    <ChannelAnalysisSectionLayout
      title="댓글 분석"
      tooltip="댓글분석~~~"
    >
      <>
        <WordCloud />
      </>
    </ChannelAnalysisSectionLayout>
  );
}
