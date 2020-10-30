import React, { useState } from 'react';
import useAxios from 'axios-hooks';
import { Grid } from '@material-ui/core';
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
import PeriodGraph from '../../../organisms/mypage/stream-analysis/PeriodGraph';
import { timelineInterface } from '../../../organisms/mypage/graph/graphsInterface';
import SubscribeContext from '../../../utils/contexts/SubscribeContext';
// import PeriodAnalysisSection from '../../../organisms/mypage/stream-analysis/period-analysis/PeriodAnalysisSection';
import PeriodAnalysisSectionTest from '../../../organisms/mypage/stream-analysis/period-analysis/PeriodAnalysisSectionTest';

interface PeriodRequestArray {
  streams: {
    creatorId: string;
    streamId: string;
    startedAt: string;
  }[];
}

export default function PeriodAnalysis(): JSX.Element {
  const [data, setData] = useState<timelineInterface | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedMetric, selectMetric] = useState<string[]>([]);
  const [{ error, loading }, getRequest] = useAxios(
    '/stream-analysis/period', { manual: true },
  );
  const subscribe = React.useContext(SubscribeContext);
  const handleSubmit = ({ category, params }: {category: string[]; params: PeriodRequestArray}) => {
    selectMetric(category);
    getRequest({ params })
      .then((res) => {
        setData(res.data);
        setOpen(true);
      });
  };

  React.useEffect(() => {
    setOpen(false);
  }, [subscribe.currUser]);

  return (
    <MypageSectionWrapper>
      <Grid container direction="column" spacing={2} style={{ minHeight: '3000px' }}>
        <Grid item>
          {/* 상단 섹션 */}
          <PeriodAnalysisSectionTest
            error={error}
            loading={loading}
            handleSubmit={handleSubmit}
            // handleGraphOpen={handleGraphOpen}
          />
        </Grid>
        <Grid item>
          {open && data
          && (
          <PeriodGraph data={data} loading={loading} selectedMetric={selectedMetric} />
          )}
        </Grid>
      </Grid>
    </MypageSectionWrapper>
  );
}
