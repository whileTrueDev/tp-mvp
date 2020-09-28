import React, { useState } from 'react';
import useAxios from 'axios-hooks';
import { Grid } from '@material-ui/core';
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
import PeriodGraph from '../../../organisms/mypage/stream-analysis/PeriodGraph';
import { timelineInterface } from '../../../organisms/mypage/graph/graphsInterface';

import PeriodAnalysisSection from '../../../organisms/mypage/stream-analysis/period-analysis/PeriodAnalysisSection';

export default function PeriodAnalysis(): JSX.Element {
  const [data, setData] = useState<timelineInterface | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [{ error, loading }, getRequest] = useAxios(
    '/stream-analysis/streams-term-info', { manual: true }
  );

  const handleSubmit = (params: any) => {
    getRequest(params)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
        setOpen(true);
      });
  };

  return (
    <MypageSectionWrapper>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          {/* 상단 섹션 */}
          <PeriodAnalysisSection error={error} loading={loading} handleSubmit={handleSubmit} />
        </Grid>
        {open && data
        && (
          <Grid item>
            <PeriodGraph data={data} loading={loading} />
          </Grid>
        )}
      </Grid>
    </MypageSectionWrapper>
  );
}
