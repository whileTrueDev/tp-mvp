import React, { useState } from 'react';
// axios
import useAxios from 'axios-hooks';
import { AxiosError } from 'axios';
import { Grid } from '@material-ui/core';
// shared dto
import { SearchStreamInfoByStreamId } from '@truepoint/shared/dist/dto/stream-analysis/searchStreamInfoByStreamId.dto';
import { StreamAnalysisResType } from '@truepoint/shared/res/StreamAnalysisResType.interface';
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
// contexts
import SubscribeContext from '../../../utils/contexts/SubscribeContext';
// organisms
import StreamCompareSection from '../../../organisms/mypage/stream-analysis/stream-vs-stream/StreamCompareSection';
import StreamMetrics from '../../../organisms/mypage/stream-analysis/StreamMetrics';
// import { metricInterface } from '../../../organisms/mypage/graph/graphsInterface';

export default function StreamAnalysis(): JSX.Element {
  const [data, setData] = useState<StreamAnalysisResType[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const [{ loading, error }, getRequest] = useAxios<StreamAnalysisResType[]>(
    '/stream-analysis/streams', { manual: true },
  );
  const subscribe = React.useContext(SubscribeContext);
  const handleSubmit = (params: SearchStreamInfoByStreamId) => {
    setOpen(false);
    getRequest({ params })
      .then((res) => {
        setData(res.data);
        setOpen(true);
      })
      .catch((err): AxiosError<any> | undefined => err);
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
            error={error
              ? { isError: true, helperText: '분석과정에서 문제가 발생했습니다.' }
              : undefined}
          />
        </Grid>
        <Grid item>
          <StreamMetrics open={open} metricData={data} />
        </Grid>
      </Grid>
    </MypageSectionWrapper>
  );
}
