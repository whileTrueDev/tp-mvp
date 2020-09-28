import React, { useState, useEffect } from 'react';
import useAxios from 'axios-hooks';
import { Grid } from '@material-ui/core';
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
import StreamMetrics from '../../../organisms/mypage/stream-analysis/StreamMetrics';
import LinearGraph from '../../../organisms/mypage/graph/LinearGraph';
// organisms
import PeriodCompareHero from '../../../organisms/mypage/stream-analysis/period-vs-period/PeriodCompareHero';

export default function PeriodVsPeriodAnalysis(): JSX.Element {
  const [timeLineData, setTimeLine] = useState<any>(null);
  const [metricData, setMetric] = useState<any>(null);
  const [type, setType] = useState<string >('');
  const [open, setOpen] = useState<boolean>(false);
  const [metricOpen, setMetricOpen] = useState<boolean>(false);

  const [, getRequest] = useAxios(
    '/stream-analysis/periods', { manual: true }
  );

  useEffect(() => {
    getRequest()
      .then((res) => {
        setTimeLine(res.data.timeline);
        setMetric(res.data.metrics);
        setType(res.data.type);
        setOpen(true);
        setTimeout(() => { setMetricOpen(true); }, 3000);
      });
  }, [getRequest]);

  return (
    <MypageSectionWrapper>
      <Grid container direction="column" spacing={2} style={{ height: 'auto' }}>
        <PeriodCompareHero />
      </Grid>
      <Grid container direction="column" spacing={8}>
        <Grid item container direction="row">
          <Grid item xs={6}>
            {open && timeLineData && <LinearGraph data={timeLineData[0]} name="period1" opposite={0} />}
          </Grid>
          <Grid item xs={6}>
            {open && timeLineData && <LinearGraph data={timeLineData[1]} name="period2" opposite={1} />}
          </Grid>
        </Grid>
        <Grid item>
          {metricOpen && metricData && <StreamMetrics open={open} metricData={metricData} type={type} />}
        </Grid>
      </Grid>
    </MypageSectionWrapper>
  );
}
