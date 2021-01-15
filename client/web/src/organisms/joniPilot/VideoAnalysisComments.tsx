import React, {
  useState, useEffect, useCallback, useMemo,
} from 'react';
import axios from 'axios';
import CenterLoading from '../../atoms/Loading/CenterLoading';
import ChannelAnalysisSectionLayout from './ChannelAnalysisSectionLayout';
import VideoAnalysisCommentPeriodSelect from './VideoAnalysisCommentPeriodSelect';
import AmWordCloud, { Word } from './AmWordCloud';
import SortedBarChart from './SortedBarChart';

const tempWordsUrl = 'https://joni-pilot.glitch.me/words';

export default function VideoAnalysisComments(): JSX.Element {
  const [posWords, setPosWords] = useState<Word[]>([]);
  const [negWords, setNegWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getWords = useCallback(() => {
    setLoading(true);
    axios.get(tempWordsUrl).then((res) => {
      setPosWords(res.data.positiveWords);
      setNegWords(res.data.negativeWords);
      setLoading(false);
    });
  }, []);

  const words = useMemo(() => [...posWords, ...negWords],
    [posWords, negWords]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(getWords, []);

  return (
    <ChannelAnalysisSectionLayout
      title="댓글 분석"
      tooltip="댓글분석~~~"
    >
      <VideoAnalysisCommentPeriodSelect onSelect={getWords} />
      <AmWordCloud
        words={words}
        useLoadingIndicator={false}
      />
      <div style={{ position: 'relative' }}>
        {loading && <CenterLoading />}
        <SortedBarChart negativeWords={negWords} positiveWords={posWords} />
      </div>

    </ChannelAnalysisSectionLayout>
  );
}
