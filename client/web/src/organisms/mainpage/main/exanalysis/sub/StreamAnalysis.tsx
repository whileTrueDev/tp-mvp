import React, { useState } from 'react';
// axios
import { useSnackbar } from 'notistack';
import { Grid, Paper } from '@material-ui/core';
// shared dto
import { SearchStreamInfoByStreamId } from '@truepoint/shared/dist/dto/stream-analysis/searchStreamInfoByStreamId.dto';
// organisms
import StreamCompareSection from '../../../../mypage/stream-analysis/stream-vs-stream/StreamCompareSection';
import StreamMetrics from '../../../../mypage/stream-analysis/StreamMetrics';
import ShowSnack from '../../../../../atoms/snackbar/ShowSnack';
// layout style
import useStreamAnalysisStyles from '../../../../../pages/mypage/stream-analysis/streamAnalysisLayout.style';
import { useStreamsAnalysisQuery } from '../../../../../utils/hooks/query/useStreamsAnalysis';

export default function StreamAnalysis(): JSX.Element {
  const classes = useStreamAnalysisStyles();
  /* 분석 그래프 상태값 */
  const [open, setOpen] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const [queryParams, setQueryParams] = useState<SearchStreamInfoByStreamId | null>(null);
  const [enable, setEnable] = useState<boolean>(false);
  /* 방송 대 방송 분석 결과 요청 */
  const { data, isFetching: loading, error } = useStreamsAnalysisQuery(queryParams, {
    enabled: enable,
    select: (d) => d.map((row) => ({ ...row, broad1Title: '예시방송 1', broad2Title: '예시방송 2' })),
    onSuccess: (res) => {
      setEnable(false);
      setOpen(true);
    },
    onError: (e) => {
      console.error(e);
      ShowSnack('분석 과정에서 문제가 발생했습니다. 다시 시도해주세요', 'error', enqueueSnackbar);
    },
  });

  const handleSubmit = (params: SearchStreamInfoByStreamId) => {
    setOpen(false);
    setQueryParams(params);
    setEnable(true);
  };

  return (
    <div>
      <Grid container direction="column">
        {/* Analysis Section */}
        <Paper className={classes.analysisSectionPaper}>
          <StreamCompareSection
            exampleMode
            handleSubmit={handleSubmit}
            loading={loading}
            error={error
              ? { isError: true, helperText: '분석과정에서 문제가 발생했습니다.' }
              : undefined}
          />
        </Paper>

        {/* Graph Section */}
        {open && (
        <Paper className={classes.graphSectionPaper}>
          <StreamMetrics
            open={open}
            metricData={data || []}
            exampleMode
          />
        </Paper>
        )}
      </Grid>
    </div>
  );
}
