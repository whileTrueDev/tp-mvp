import React, { useState } from 'react';
// axios
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
// material - ui core
import { Grid, Paper } from '@material-ui/core';
// shared dtos
import { SearchStreamInfoByPeriods } from '@truepoint/shared/dist/dto/stream-analysis/searchStreamInfoByPeriods.dto';
import { PeriodsAnalysisResType } from '@truepoint/shared/dist/res/PeriodsAnalysisResType.interface';
import { EachStream } from '@truepoint/shared/dist/dto/stream-analysis/eachStream.dto';
// Layout
// import { AnyMxRecord } from 'dns';
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
// contexts
// import SubscribeContext from '../../../utils/contexts/SubscribeContext';
// organisms
import StreamMetrics from '../../../organisms/mypage/stream-analysis/StreamMetrics';
import LinearGraph from '../../../organisms/mypage/graph/LinearGraph';
import PeriodCompareSection from '../../../organisms/mypage/stream-analysis/period-vs-period/PeriodCompareSection';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import MypageHero from '../../../organisms/shared/sub/MypageHero';
import textSource from '../../../organisms/shared/source/MypageHeroText';
// layout style
import useStreamAnalysisStyles from './streamAnalysisLayout.style';

export interface PeriodsRequestParams {
  userId: string;
  baseStartAt: string;
  baseEndAt: string;
  compareStartAt: string;
  compareEndAt: string;
}

export default function PeriodVsPeriodAnalysis(): JSX.Element {
  const classes = useStreamAnalysisStyles();
  const [timeLineData, setTimeLine] = useState<EachStream[][]>();
  const [metricData, setMetric] = useState<any>(null);
  const [type, setType] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [metricOpen, setMetricOpen] = useState<boolean>(false);
  const [selectedMetric, selectMetric] = useState<string[]>([]);
  // const subscribe = React.useContext(SubscribeContext);
  const [{ loading, error }, getRequest] = useAxios<PeriodsAnalysisResType>(
    '/stream-analysis/periods', { manual: true },
  );
  const { enqueueSnackbar } = useSnackbar();
  const handleSubmit = ({
    category, params,
  }: {category: string[]; params: SearchStreamInfoByPeriods}) => {
    selectMetric(category); // 다중 선택으로 변경시 []을 제거한다.
    setOpen(false);
    setMetricOpen(false);

    getRequest({
      data: params,
      method: 'POST',
    })
      .then((res) => {
        setTimeLine(res.data.timeline);
        setMetric(res.data.metrics);
        if (res.data.type) setType(res.data.type);
        setOpen(true);
        setTimeout(() => {
          setMetricOpen(true);
        }, 1000);
      })
      .catch(() => {
        ShowSnack('분석 과정에서 문제가 발생했습니다. 다시 시도해주세요', 'error', enqueueSnackbar);
      });
  };

  // React.useEffect(() => {
  //   setOpen(false);
  // }, [subscribe.currUser]);

  return (
    <>
      <MypageSectionWrapper>
        {/* Hero Section */}
        <MypageHero textSource={textSource.streamAnalysisSection} />
      </MypageSectionWrapper>

      <MypageSectionWrapper>
        {/* Analysis Section */}
        <Grid container direction="column" style={{ minHeight: '1500px' }}>
          <Paper elevation={0} className={classes.analysisSectionPaper}>
            <PeriodCompareSection
              loading={loading}
              error={error ? { isError: true, helperText: '분석과정에서 문제가 발생했습니다.' } : undefined}
              handleSubmit={handleSubmit}
            />
          </Paper>

          {/* Graph Section */}
          {open && (
          <Paper elevation={0} className={classes.graphSectionPaper}>
            <Grid item container direction="column" spacing={8} style={{ marginTop: '16px' }}>
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
          </Paper>
          )}
        </Grid>
      </MypageSectionWrapper>
    </>

  );
}
