import React, { useState } from 'react';
// axios
import useAxios from 'axios-hooks';
import { AxiosError } from 'axios';
// material - ui core
import { Grid, Paper } from '@material-ui/core';
// shared
import { SearchEachS3StreamData } from '@truepoint/shared/dist/dto/stream-analysis/searchS3StreamData.dto';
import { PeriodAnalysisResType } from '@truepoint/shared/dist/res/PeriodAnalysisResType.interface';
// attoms
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
// Graph components
import PeriodGraph from '../../../organisms/mypage/stream-analysis/PeriodGraph';
// contexts
import SubscribeContext from '../../../utils/contexts/SubscribeContext';
import PeriodAnalysisSection from '../../../organisms/mypage/stream-analysis/period-analysis/PeriodAnalysisSection';

export default function PeriodAnalysis(): JSX.Element {
  const [data, setData] = useState<PeriodAnalysisResType>();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedMetric, selectMetric] = useState<string[]>([]);
  const [{ error, loading }, getRequest] = useAxios<PeriodAnalysisResType>(
    '/stream-analysis/period', { manual: true },
  );
  const subscribe = React.useContext(SubscribeContext);
  const handleSubmit = ({ category, params }: {category: string[]; params: SearchEachS3StreamData[]}) => {
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
      <Grid container direction="column" spacing={2} style={{ minHeight: '1500px' }}>
        <Paper elevation={1} style={{ padding: '40px', marginBottom: '16px' }}>
          {/* 상단 섹션 */}
          <PeriodAnalysisSection
            error={error ? ({ isError: true, helperText: '분석과정에서 문제가 발생했습니다.' }) : undefined}
            loading={loading}
            handleSubmit={handleSubmit}
            // handleGraphOpen={handleGraphOpen}
          />
        </Paper>

        {/* 하단 섹션 */}
        {open && data
         && (
           <Paper elevation={1} style={{ padding: '40px' }}>
             <PeriodGraph data={data} loading={loading} selectedMetric={selectedMetric} />
           </Paper>
         )}

      </Grid>
    </MypageSectionWrapper>
  );
}
