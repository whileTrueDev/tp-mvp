import React, { useState } from 'react';
import useAxios from 'axios-hooks';
import { Grid } from '@material-ui/core';
// shared dto
import { FindStreamInfoByStreamId } from '@truepoint/shared/dist/dto/FindStreamInfoByStreamId.dto';
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
// contexts
import SubscribeContext from '../../../utils/contexts/SubscribeContext';
// organisms
import StreamCompareSection from '../../../organisms/mypage/stream-analysis/stream-vs-stream/StreamCompareSection';
import StreamMetrics from '../../../organisms/mypage/stream-analysis/StreamMetrics';
import { metricInterface } from '../../../organisms/mypage/graph/graphsInterface';

export default function StreamAnalysis(): JSX.Element {
  const [data, setData] = useState<metricInterface[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [{ loading, error }, getRequest] = useAxios(
    '/stream-analysis/streams', { manual: true },
  );
  const subscribe = React.useContext(SubscribeContext);
  const handleSubmit = (params: FindStreamInfoByStreamId) => {
    setOpen(false);
    getRequest({
      params,
    })
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
      <Grid container direction="column" spacing={2} style={{ height: 'auto' }}>
        <Grid item>
          <StreamCompareSection
            handleSubmit={handleSubmit}
            loading={loading}
            error={error ? { isError: true, helperText: '분석과정에서 문제가 발생했습니다.' } : undefined}
          />
        </Grid>
        <Grid item>
          <StreamMetrics open={open} metricData={data} />
        </Grid>
      </Grid>
    </MypageSectionWrapper>
  );
}
