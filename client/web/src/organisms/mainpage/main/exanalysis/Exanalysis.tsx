import React, { useState } from 'react';
import {
  Container, Grid, Button, Typography,
} from '@material-ui/core';
import shortid from 'shortid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import styles from '../style/ExAnalysis.style';
// import source from '../source/textsource';
import StreamAnalysis from './sub/StreamAnalysis';
import PeriodAnalysis from './sub/PeriodAnalysis';
import PeriodVsAnalysis from './sub/PeriodVsAnalysis';
import HighlightAnalysisLayout from '../../../mypage/layouts/HighlightAnalysisLayout';

interface AnalysisType {
    [key: string]: string
    highlightAnalysis: string
    streamAnalysis: string
    periodAnalysis: string
    periodVsAnalysis: string
}

export default function Exanalysis(): JSX.Element {
  const theme = useTheme();
  const isSMSizeDisplay = useMediaQuery(theme.breakpoints.down('sm'));

  const exType: AnalysisType = {
    highlightAnalysis: '편집점 분석',
    streamAnalysis: '방송별 분석',
    periodAnalysis: '기간추세 분석',
    periodVsAnalysis: '기간대 기간 분석',
  };
  const [analysisType, setAnalysisType] = useState<string>(exType.highlightAnalysis);
  const classes = styles();

  function handleExType(type: string) {
    setAnalysisType(exType[type]);
  }

  function renderAnalysisContent(key: string) {
    switch (key) {
      case '방송별 분석':
        return <StreamAnalysis />;
      case '기간추세 분석':
        return <PeriodAnalysis />;
      case '기간대 기간 분석':
        return <PeriodVsAnalysis />;
      default:
        return <HighlightAnalysisLayout exampleMode />;
    }
  }

  return (
    <div className={classes.root}>
      <Container>
        <Grid container direction="column" justify="center" alignItems="flex-start">
          <Grid item md={12} sm={12} xs={12} className={classes.wrapper}>
            {Object.keys(exType).map((key) => (
              <Button
                key={shortid.generate()}
                className={analysisType === exType[key] ? classes.button : classes.notSelectedButton}
                onClick={() => handleExType(key)}
              >
                {exType[key]}
              </Button>
            ))}
          </Grid>
          <Grid item md={12} sm={12} xs={12} className={classes.analysisWrap}>
            { !isSMSizeDisplay
              ? renderAnalysisContent(analysisType)
              : (
                <Typography variant="subtitle1" align="center" className={classes.downAnalysisWrap}>
                  PC 및 태블릿 화면에서 예시 기능을 사용해보세요!
                </Typography>
              )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
