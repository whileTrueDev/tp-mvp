import React, { useState } from 'react';
// material - ui core
import { Grid, Paper } from '@material-ui/core';
// shared
import { SearchEachS3StreamData } from '@truepoint/shared/dist/dto/stream-analysis/searchS3StreamData.dto';
// attoms
import { useSnackbar } from 'notistack';
// Graph components
import PeriodGraph from '../../../../mypage/stream-analysis/PeriodGraph';
// contexts
import PeriodAnalysisSection from '../../../../mypage/stream-analysis/period-analysis/PeriodAnalysisSection';
import ShowSnack from '../../../../../atoms/snackbar/ShowSnack';
// layout style
import useStreamAnalysisStyles from '../../../../../pages/mypage/stream-analysis/streamAnalysisLayout.style';
import { usePeriodAnalysisQuery } from '../../../../../utils/hooks/query/usePeriodAnalysisQuery';

export default function PeriodAnalysis(): JSX.Element {
  const classes = useStreamAnalysisStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedMetric, selectMetric] = useState<string[]>([]);
  /* 기간 추이 분석 분석 결과 요청 */
  const [queryEnabled, setQueryEnabled] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<SearchEachS3StreamData[] | null>(null);
  const { data, error, isFetching: loading } = usePeriodAnalysisQuery(queryParams, {
    enabled: queryEnabled,
    onSuccess: () => {
      setOpen(true);
      setQueryEnabled(false);
    },
    onError: () => {
      ShowSnack('분석 과정에서 문제가 발생했습니다. 다시 시도해주세요', 'error', enqueueSnackbar);
    },
  });
  const { enqueueSnackbar } = useSnackbar();
  const handleSubmit = ({ category, params }: {category: string[]; params: SearchEachS3StreamData[]}) => {
    setQueryParams(params);
    setQueryEnabled(true);

    selectMetric(category);
  };

  React.useEffect(() => {
    setOpen(false);
  }, []);

  return (
    <div>
      <Grid container direction="column">
        <Paper className={classes.analysisSectionPaper}>
          {/* Analysis Section */}
          <PeriodAnalysisSection
            exampleMode
            error={error ? ({ isError: true, helperText: '분석과정에서 문제가 발생했습니다.' }) : undefined}
            loading={loading}
            handleSubmit={handleSubmit}
          />
        </Paper>

        {/* Graph Section */}
        {open && data
         && (
           <Paper className={classes.graphSectionPaper}>
             <PeriodGraph data={data} loading={loading} selectedMetric={selectedMetric} />
           </Paper>
         )}

      </Grid>
    </div>
  );
}
