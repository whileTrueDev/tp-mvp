import React, { useState } from 'react';
// axios
import useAxios from 'axios-hooks';
import { AxiosError } from 'axios';
// material - ui core
import { Grid } from '@material-ui/core';
// shared
import { EachS3StreamData } from '@truepoint/shared/dist/dto/EachS3StreamData.dto';
import { PeriodAnalysisResType } from '@truepoint/shared/dist/res/PeriodAnalysisResType.interface';
// attoms
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
// Graph components
import PeriodGraph from '../../../organisms/mypage/stream-analysis/PeriodGraph';
// import { timelineInterface } from '../../../organisms/mypage/graph/graphsInterface';
// contexts
import SubscribeContext from '../../../utils/contexts/SubscribeContext';
// AnalysisSection components
import PeriodAnalysisSection from '../../../organisms/mypage/stream-analysis/period-analysis/PeriodAnalysisSection';

export default function PeriodAnalysis(): JSX.Element {
  const [data, setData] = useState<PeriodAnalysisResType>();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedMetric, selectMetric] = useState<string[]>([]);
  const [{ error, loading }, getRequest] = useAxios<PeriodAnalysisResType>(
    '/stream-analysis/period', { manual: true },
  );
  const subscribe = React.useContext(SubscribeContext);
  const handleSubmit = ({ category, params }: {category: string[]; params: EachS3StreamData[]}) => {
    selectMetric(category);
    getRequest({
      params: {
        streams: params,
      },
    })
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
      <Grid container direction="column" spacing={2}>
        <Grid item>
          {/* 상단 섹션 */}
          <PeriodAnalysisSection
            error={error ? ({ isError: true, helperText: '분석과정에서 문제가 발생했습니다.' }) : undefined}
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
