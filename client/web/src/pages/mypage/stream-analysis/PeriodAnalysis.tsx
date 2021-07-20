import React, { useState } from 'react';
// axios
import useAxios from 'axios-hooks';
// material - ui core
import { Grid, Paper } from '@material-ui/core';
// shared
import { SearchEachS3StreamData } from '@truepoint/shared/dist/dto/stream-analysis/searchS3StreamData.dto';
import { PeriodAnalysisResType } from '@truepoint/shared/dist/res/PeriodAnalysisResType.interface';
// attoms
import { useSnackbar } from 'notistack';
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
// Graph components
import PeriodGraph from '../../../organisms/mypage/stream-analysis/PeriodGraph';
// contexts
import SubscribeContext from '../../../utils/contexts/SubscribeContext';
import PeriodAnalysisSection from '../../../organisms/mypage/stream-analysis/period-analysis/PeriodAnalysisSection';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import MypageHero from '../../../organisms/shared/sub/MypageHero';
import textSource from '../../../organisms/shared/source/MypageHeroText';
// layout style
import useStreamAnalysisStyles from './streamAnalysisLayout.style';
// hook
import useScrollTop from '../../../utils/hooks/useScrollTop';

export default function PeriodAnalysis(): JSX.Element {
  const classes = useStreamAnalysisStyles();
  const [data, setData] = useState<PeriodAnalysisResType>();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedMetric, selectMetric] = useState<string[]>([]);
  /* 기간 추이 분석 분석 결과 요청 */
  const [{ error, loading }, getRequest] = useAxios<PeriodAnalysisResType>(
    {
      url: '/stream-analysis/period',
      method: 'get',
      headers: { 'Access-Control-Allow-Origin': '*' },
    },
    { manual: true },
  );
  const subscribe = React.useContext(SubscribeContext);
  const { enqueueSnackbar } = useSnackbar();
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
      .catch(() => {
        ShowSnack('분석 과정에서 문제가 발생했습니다. 다시 시도해주세요', 'error', enqueueSnackbar);
      });
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
        <Grid container direction="column" style={{ minHeight: '1500px' }}>
          <Paper className={classes.analysisSectionPaper}>
            {/* Analysis Section */}
            <PeriodAnalysisSection
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
      </MypageSectionWrapper>
    </>

  );
}
