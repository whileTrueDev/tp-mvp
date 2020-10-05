import React, { useState } from 'react';
import useAxios from 'axios-hooks';
import { Grid } from '@material-ui/core';
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
import StreamMetrics from '../../../organisms/mypage/stream-analysis/StreamMetrics';
import { metricInterface } from '../../../organisms/mypage/graph/graphsInterface';

// organisms
import StreamCompareSection from '../../../organisms/mypage/stream-analysis/stream-vs-stream/StreamCompareSection';

export default function StreamAnalysis(): JSX.Element {
  const [data, setData] = useState<metricInterface[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [{ loading, error }, getRequest] = useAxios(
    '/stream-analysis/streams', { manual: true }
  );

  const handleSubmit = (streams: {streamId: string, platform: string}[]) => {
    setOpen(false);
    getRequest({
      params: {
        streams
      }
    })
      .then((res) => {
        setData(res.data);
        setOpen(true);
      });
  };

  return (
    <MypageSectionWrapper>
      <Grid container direction="column" spacing={2} style={{ height: 'auto' }}>
        <Grid item>
          <StreamCompareSection handleSubmit={handleSubmit} loading={loading} error={error} />
        </Grid>
        <Grid item>
          <StreamMetrics open={open} metricData={data} />
        </Grid>
      </Grid>
    </MypageSectionWrapper>
  );
}
