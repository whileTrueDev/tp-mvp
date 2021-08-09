import React, { useState } from 'react';
// axios
import { useSnackbar } from 'notistack';
import { Grid, Paper } from '@material-ui/core';
// shared dto
import { SearchStreamInfoByStreamId } from '@truepoint/shared/dist/dto/stream-analysis/searchStreamInfoByStreamId.dto';
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
// contexts
import SubscribeContext from '../../../utils/contexts/SubscribeContext';
// organisms
import StreamCompareSection from '../../../organisms/mypage/stream-analysis/stream-vs-stream/StreamCompareSection';
import StreamMetrics from '../../../organisms/mypage/stream-analysis/StreamMetrics';
// import { metricInterface } from '../../../organisms/mypage/graph/graphsInterface';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import MypageHero from '../../../organisms/shared/sub/MypageHero';
import textSource from '../../../organisms/shared/source/MypageHeroText';
// layout style
import useStreamAnalysisStyles from './streamAnalysisLayout.style';
import useScrollTop from '../../../utils/hooks/useScrollTop';
import { useStreamsAnalysisQuery } from '../../../utils/hooks/query/useStreamsAnalysis';

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
    onSuccess: (res) => {
      setEnable(false);
      setOpen(true);
    },
    onError: (e) => {
      console.error(e);
      ShowSnack('분석 과정에서 문제가 발생했습니다. 다시 시도해주세요', 'error', enqueueSnackbar);
    },
  });

  const subscribe = React.useContext(SubscribeContext);
  const handleSubmit = (params: SearchStreamInfoByStreamId) => {
    setOpen(false);
    setQueryParams(params);
    setEnable(true);
  };

  React.useEffect(() => {
    setOpen(false);
  }, [subscribe.currUser]);
  // 처음 페이지 렌더링시 화면 최상단으로 스크롤이동
  useScrollTop();
  return (
    <>
      <MypageSectionWrapper>
        {/* Hero Section */}
        <MypageHero textSource={textSource.streamAnalysisSection} />
      </MypageSectionWrapper>

      <MypageSectionWrapper>
        <Grid container direction="column">
          {/* Analysis Section */}
          <Paper className={classes.analysisSectionPaper}>
            <StreamCompareSection
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
              <StreamMetrics open={open} metricData={data || []} />
            </Paper>
          )}
        </Grid>
      </MypageSectionWrapper>
    </>

  );
}
