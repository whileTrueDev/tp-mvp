import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
// material - ui core
import {
  Grid, Paper,
} from '@material-ui/core';
// shared dtos
import { SearchStreamInfoByPeriods } from '@truepoint/shared/dist/dto/stream-analysis/searchStreamInfoByPeriods.dto';

// contexts
// import SubscribeContext from '../../../utils/contexts/SubscribeContext';
// organisms
import PeriodCompareGraph from '../../../../mypage/stream-analysis/period-vs-period/PeriodCompareGraph';
import PeriodCompareSection from '../../../../mypage/stream-analysis/period-vs-period/PeriodCompareSection';
import ShowSnack from '../../../../../atoms/snackbar/ShowSnack';
// layout style
import useStreamAnalysisStyles from '../../../../../pages/mypage/stream-analysis/streamAnalysisLayout.style';
import { usePeriodVsPeriodAnalysisQuery } from '../../../../../utils/hooks/query/usePeriodVsPeriodAnalysisQuery';

export type CompareMetric = 'viewer'|'smileCount'|'chatCount';

export default function PeriodVsPeriodAnalysis(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStreamAnalysisStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [metricOpen, setMetricOpen] = useState<boolean>(false);
  // const subscribe = React.useContext(SubscribeContext);

  /* 기간 대 기간 비교 분석 결과 요청 */
  const [queryParams, setQueryParams] = useState<SearchStreamInfoByPeriods | null>(null);
  const [queryEnabled, setQueryEnabled] = useState<boolean>(false);
  const { data, isFetching: loading, error } = usePeriodVsPeriodAnalysisQuery(queryParams, {
    enabled: queryEnabled,
    onSuccess: () => {
      setQueryEnabled(false);
      setOpen(true);
      setTimeout(() => {
        setMetricOpen(true);
      }, 1000);
    },
    onError: () => ShowSnack('분석 과정에서 문제가 발생했습니다. 다시 시도해주세요', 'error', enqueueSnackbar),
  });

  /* 체크박스 그룹 선택값 -> 기간 대 기간 비교 그래프 지표값 */
  const [compareMetrics, setCompareMetrics] = React.useState<CompareMetric[]>([]); // 체크박스에서 선택된 지표값 리스트
  const [selectedCompareMetric, setSelectedCompareMetric] = React.useState<CompareMetric>('viewer'); // 현재 선택된 지표값
  const handleSelectCompareMetric = (newMetric: CompareMetric) => setSelectedCompareMetric(newMetric); // 선택된 지표값 변경 핸들러

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

    setQueryParams(params);
    setQueryEnabled(true);
  };

  return (
    <div>
      {/* Analysis Section */}
      <Grid container direction="column">
        <Paper className={classes.analysisSectionPaper}>
          <PeriodCompareSection
            exampleMode
            loading={loading}
            error={error ? { isError: true, helperText: '분석과정에서 문제가 발생했습니다.' } : undefined}
            handleSubmit={handleSubmit}
          />
        </Paper>

        {/* Graph Section */}
        {open && data && (
          <Paper className={classes.graphSectionPaper}>
            {/* 따로 organisms 컴포넌트로 만들어야 할 것 같습니다! by @hwasurr 2020.12.10 레이아웃 수정 작업중 코멘트 */}
            <PeriodCompareGraph
              handleSelectCompareMetric={handleSelectCompareMetric}
              selectedCompareMetric={selectedCompareMetric}
              compareMetrics={compareMetrics}
              timeLineData={data.timeline}
              metricData={data.metrics}
              metricOpen={metricOpen}
              type={data.type || ''}
            />
          </Paper>
        )}
      </Grid>
    </div>
  );
}
