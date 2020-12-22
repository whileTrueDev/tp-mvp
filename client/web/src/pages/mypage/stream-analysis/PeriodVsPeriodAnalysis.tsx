import React, { useState } from 'react';
// axios
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
// material - ui core
import {
  Grid, Paper,
} from '@material-ui/core';
// shared dtos
import { SearchStreamInfoByPeriods } from '@truepoint/shared/dist/dto/stream-analysis/searchStreamInfoByPeriods.dto';
import { PeriodsAnalysisResType } from '@truepoint/shared/dist/res/PeriodsAnalysisResType.interface';
import { EachStream } from '@truepoint/shared/dist/dto/stream-analysis/eachStream.dto';
// Layout
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
// contexts
// import SubscribeContext from '../../../utils/contexts/SubscribeContext';
// organisms
import PeriodCompareGraph from '../../../organisms/mypage/stream-analysis/period-vs-period/PeriodCompareGraph';
import PeriodCompareSection from '../../../organisms/mypage/stream-analysis/period-vs-period/PeriodCompareSection';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import MypageHero from '../../../organisms/shared/sub/MypageHero';
import textSource from '../../../organisms/shared/source/MypageHeroText';
// layout style
import useStreamAnalysisStyles from './streamAnalysisLayout.style';
import useScrollTop from '../../../utils/hooks/useScrollTop';

export interface PeriodsRequestParams {
  userId: string;
  baseStartAt: string;
  baseEndAt: string;
  compareStartAt: string;
  compareEndAt: string;
}
export type CompareMetric = 'viewer'|'smileCount'|'chatCount';

export default function PeriodVsPeriodAnalysis(): JSX.Element {
  const classes = useStreamAnalysisStyles();
  const [timeLineData, setTimeLine] = useState<EachStream[][]>();
  const [metricData, setMetric] = useState<any>(null);
  const [type, setType] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [metricOpen, setMetricOpen] = useState<boolean>(false);
  // const subscribe = React.useContext(SubscribeContext);
  const [{ loading, error }, getRequest] = useAxios<PeriodsAnalysisResType>(
    '/stream-analysis/periods', { manual: true },
  );
  const { enqueueSnackbar } = useSnackbar();

  const [compareMetrics, setCompareMetrics] = React.useState<CompareMetric[]>([]);
  const [selectedCompareMetric, setSelectedCompareMetric] = React.useState<CompareMetric>('viewer');
  const handleSelectCompareMetric = (newMetric: CompareMetric) => setSelectedCompareMetric(newMetric);

  /**
   * 분석 요청 함수
   * @param category
   * @param params
   */
  const handleSubmit = ({
    category, params,
  }: {category: CompareMetric[]; params: SearchStreamInfoByPeriods}) => {
    setCompareMetrics(category);
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

  /* 구독 관련 기능 - CBT 주석 사항 */
  // React.useEffect(() => {
  //   setOpen(false);
  // }, [subscribe.currUser]);

  // 처음 페이지 렌더링시 화면 최상단으로 스크롤이동
  useScrollTop();
  return (
    <>
      <MypageSectionWrapper>
        {/* Hero Section */}
        <MypageHero textSource={textSource.streamAnalysisSection} />
      </MypageSectionWrapper>

      <MypageSectionWrapper>
        {/* Analysis Section */}
        <Grid container direction="column" style={{ minHeight: '1500px' }}>
          <Paper className={classes.analysisSectionPaper}>
            <PeriodCompareSection
              loading={loading}
              error={error ? { isError: true, helperText: '분석과정에서 문제가 발생했습니다.' } : undefined}
              handleSubmit={handleSubmit}
            />
          </Paper>

          {/* Graph Section */}
          {open && timeLineData && metricData && (
          <Paper className={classes.graphSectionPaper}>
            {/* 따로 organisms 컴포넌트로 만들어야 할 것 같습니다! by @hwasurr 2020.12.10 레이아웃 수정 작업중 코멘트 */}
            <PeriodCompareGraph
              handleSelectCompareMetric={handleSelectCompareMetric}
              selectedCompareMetric={selectedCompareMetric}
              compareMetrics={compareMetrics}
              timeLineData={timeLineData}
              metricData={metricData}
              metricOpen={metricOpen}
              type={type}
            />
          </Paper>
          )}
        </Grid>
      </MypageSectionWrapper>
    </>

  );
}
