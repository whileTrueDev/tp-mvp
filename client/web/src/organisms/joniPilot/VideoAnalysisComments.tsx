import React, {
  useState, useEffect, useCallback, useMemo,
} from 'react';
// import useAxios from 'axios-hooks';
import axios from 'axios';
import CenterLoading from '../../atoms/Loading/CenterLoading';
import ChannelAnalysisSectionLayout from './ChannelAnalysisSectionLayout';
import AmWordCloud, { Word } from './AmWordCloud';
import SortedBarChart from './SortedBarChart';
import VideoAnalysisCommentPeriodSelect from './VideoAnalysisCommentPeriodSelect';

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

  useEffect(() => {
    getWords();
  }, []);

  return (
    <ChannelAnalysisSectionLayout
      title="댓글 분석"
      tooltip="댓글분석~~~"
    >
      <div style={{ position: 'relative' }}>
        {loading && <CenterLoading />}
        <VideoAnalysisCommentPeriodSelect onSelect={getWords} />
        <AmWordCloud words={words} />
      </div>
      <SortedBarChart negativeWords={negWords} positiveWords={posWords} />

    </ChannelAnalysisSectionLayout>
  );
}
