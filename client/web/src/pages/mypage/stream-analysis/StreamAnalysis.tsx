import React, { useState } from 'react';
import useAxios from 'axios-hooks';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
import StreamMetrics from '../../../organisms/mypage/stream-analysis/StreamMetrics';
import { metricInterface } from '../../../organisms/mypage/graph/graphsInterface';

// organisms
import StreamCompareHero from '../../../organisms/mypage/streamAnalysis/stream-vs-stream/StreamCompareHero';
import StreamCompareBody from '../../../organisms/mypage/streamAnalysis/stream-vs-stream/StreamCompareBody';

export default function StreamAnalysis(): JSX.Element {
  const [data, setData] = useState<metricInterface[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [, getRequest] = useAxios(
    '/stream-analysis/streams', { manual: true }
  );

  const onSubmit = () => {
    setOpen(false);
    getRequest({
      params: {
        streams:
        [
          { streamId: 's1', platform: 'afreeca' },
          { streamId: 's5', platform: 'afreeca' }
        ]
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
        <StreamCompareHero />
        <StreamCompareBody />
      </Grid>
      <Button onClick={onSubmit}>와우</Button>
      <StreamMetrics open={open} metricData={data} />
    </MypageSectionWrapper>
  );
}
