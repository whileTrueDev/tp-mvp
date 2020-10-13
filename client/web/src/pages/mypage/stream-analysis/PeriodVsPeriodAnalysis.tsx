import React, { useState } from 'react';
import useAxios from 'axios-hooks';
import { Grid } from '@material-ui/core';
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
import StreamMetrics from '../../../organisms/mypage/stream-analysis/StreamMetrics';
import LinearGraph from '../../../organisms/mypage/graph/LinearGraph';
import SubscribeContext from '../../../utils/contexts/SubscribeContext';
// organisms
import PeriodCompareSection from '../../../organisms/mypage/stream-analysis/period-vs-period/PeriodCompareSection';

export interface PeriodsRequestParams {
  userId: string;
  baseStartAt: string;
  baseEndAt: string;
  compareStartAt: string;
  compareEndAt: string;
}

export default function PeriodVsPeriodAnalysis(): JSX.Element {
  const [timeLineData, setTimeLine] = useState<any>(null);
  const [metricData, setMetric] = useState<any>(null);
  const [type, setType] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [metricOpen, setMetricOpen] = useState<boolean>(false);
  const [selectedMetric, selectMetric] = useState<string[]>([]);
  const subscribe = React.useContext(SubscribeContext);
  const [{ loading, error }, getRequest] = useAxios(
    '/stream-analysis/periods', { manual: true },
  );

  const handleSubmit = ({
    category, params,
  }: {category: string[]; params: PeriodsRequestParams}) => {
    selectMetric(category); // 다중 선택으로 변경시 []을 제거한다.
    setOpen(false);
    setMetricOpen(false);
    getRequest({ params })
      .then((res) => {
        // check https://yeon-js.tistory.com/8
        // if (res.data.hasOwnProperty('error')) {
        if (Object.prototype.hasOwnProperty.call(res.data, 'error')) {
          alert(res.data.error);
        } else {
          setTimeLine(res.data.timeline);
          setMetric(res.data.metrics);
          setType(res.data.type);
          setOpen(true);
          setTimeout(() => {
            setMetricOpen(true);
          }, 1000);
        }
      });
  };

  React.useEffect(() => {
    setOpen(false);
  }, [subscribe.currUser]);

  return (
    <MypageSectionWrapper>
      <Grid container direction="column" spacing={2} style={{ height: 'auto' }}>
        <Grid item>
          <PeriodCompareSection
            loading={loading}
            error={error}
            handleSubmit={handleSubmit}
          />
        </Grid>
        {open && (
        <Grid item container direction="column" spacing={8}>
          <Grid item container direction="row">
            <Grid item xs={6}>
              {timeLineData && (
              <LinearGraph
                data={timeLineData[0]}
                name="period1"
                opposite={0}
                selectedMetric={selectedMetric}
              />
              )}
            </Grid>
            <Grid item xs={6}>
              {timeLineData && (
              <LinearGraph
                data={timeLineData[1]}
                name="period2"
                opposite={1}
                selectedMetric={selectedMetric}
              />
              )}
            </Grid>
          </Grid>
          <Grid item>
            {metricOpen && metricData && (
            <StreamMetrics
              open={metricOpen}
              metricData={metricData}
              type={type}
            />
            )}
          </Grid>
        </Grid>
        )}
      </Grid>
    </MypageSectionWrapper>
  );
}
