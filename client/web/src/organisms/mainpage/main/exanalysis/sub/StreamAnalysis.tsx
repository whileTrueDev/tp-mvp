import React, { useState } from 'react';
// axios
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import { Grid, Paper } from '@material-ui/core';
// shared dto
import { SearchStreamInfoByStreamId } from '@truepoint/shared/dist/dto/stream-analysis/searchStreamInfoByStreamId.dto';
import { StreamAnalysisResType } from '@truepoint/shared/res/StreamAnalysisResType.interface';
// organisms
import StreamCompareSection from '../../../../mypage/stream-analysis/stream-vs-stream/StreamCompareSection';
import StreamMetrics from '../../../../mypage/stream-analysis/StreamMetrics';
import ShowSnack from '../../../../../atoms/snackbar/ShowSnack';
// layout style
import useStreamAnalysisStyles from '../../../../../pages/mypage/stream-analysis/streamAnalysisLayout.style';

export default function StreamAnalysis(): JSX.Element {
  const classes = useStreamAnalysisStyles();
  /* 분석 그래프 상태값 */
  const [data, setData] = useState<StreamAnalysisResType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  /* 방송 대 방송 분석 결과 요청 */
  const [{ loading, error }, getRequest] = useAxios<StreamAnalysisResType[]>(
    '/stream-analysis/streams', { manual: true },
  );
  const handleSubmit = (params: SearchStreamInfoByStreamId) => {
    setOpen(false);
    getRequest({ params })
      .then((res) => {
        const result = res.data.map((row) => ({ ...row, broad1Title: '예시방송 1', broad2Title: '예시방송 2' }));
        setData(result);
        setOpen(true);
      })
      .catch(() => {
        ShowSnack('분석 과정에서 문제가 발생했습니다. 다시 시도해주세요', 'error', enqueueSnackbar);
      });
  };

  React.useEffect(() => {
    setOpen(false);
  }, []);

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
            metricData={data}
            exampleMode
          />
        </Paper>
        )}
      </Grid>
    </div>
  );
}
