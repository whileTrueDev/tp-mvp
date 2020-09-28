import React, { useContext, useState } from 'react';
// material-ui core components
import {
  Paper, Typography, Grid, Divider, Button
} from '@material-ui/core';
// axios
import useAxios from 'axios-hooks';
// subcomponents
import RangeSelectCaledar from './RangeSelectCalendar';
import PeriodCompareTextField from './PeriodCompareTextField';
import CheckBoxGroup from './CheckBoxGroup';
// svg icons
import SelectDateIcon from '../../../../atoms/stream-analysis-icons/SelectDateIcon';
// styles
import useperiodCompareStyles from './PeriodCompareSection.style';
// attoms
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
import ErrorSnackBar from '../../../../atoms/snackbar/ErrorSnackBar';
// contexterLoa
import SubscribeContext from '../../../../utils/contexts/SubscribeContext';

export default function PeriodCompareSection(): JSX.Element {
  const classes = useperiodCompareStyles();
  const subscribe = useContext(SubscribeContext);
  const [baseperiod, setBaseperiod] = useState<Date[]>(new Array<Date>(2));
  const [compareperiod, setCompareperiod] = useState<Date[]>(new Array<Date>(2));
  const [checkStateGroup, setCheckStateGroup] = useState({
    viewer: false,
    chat: false,
    smile: false,
    // searchKeyWord: string,
  });
  // 서버 수정 코드 확인 후 타입 정의 할 것.
  /* 분석 결과 */
  const [resultData, setResultData] = useState<any[]>();

  const [
    {
      data: getAnalysisData,
      loading: getAnalysisLoading,
      error: getAnalysisError
    }, excuteGetAnalysis] = useAxios<any[]>({
      url: 'http://localhost:3000/stream-analysis/terms',
    }, { manual: true });

  const handleCheckStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckStateGroup({
      ...{
        viewer: false,
        chat: false,
        smile: false,
        // searchKeyWord: string,
      },
      [event.target.name]: event.target.checked
    });
  };

  const handleperiod = (startAt: Date, endAt: Date, base?: true) => {
    const per = [startAt, endAt];
    if (base) {
      setBaseperiod(per);
    } else {
      setCompareperiod(per);
    }
  };

  const handleAnalysisButton = () => {
    // 기간 2개 + 분석 항목 (viewer | chatCount | smileCount)
    const selectedCategory = Object.keys(checkStateGroup);
    excuteGetAnalysis({
      params: {
        userId: subscribe.currUser.targetUserId,
        baseperiod,
        compareperiod,
        category: selectedCategory[Object.values(checkStateGroup).indexOf(true)]
      }
    }).then((res) => {
      if (res.data) setResultData(res.data);
    });
  };

  return (
    <div className={classes.root}>
      {getAnalysisLoading
        && <CenterLoading />}
      {getAnalysisError
      && (
      <ErrorSnackBar
        message="오류가 발생했습니다. 다시 시도해주세요."
      />
      )}
      <Divider className={classes.titleDivider} />
      <Typography className={classes.mainTitle}>
        기간 대 기간 분석
      </Typography>
      <Typography className={classes.infoText}>
        * 데이터 제공 기간을 벗어난 데이터는 확인하실 수 없습니다.
      </Typography>
      <Typography className={classes.mainBody}>
        기간별 분석을 위한 기간을 설정해 주세요.
      </Typography>
      <Grid container direction="row" justify="center">
        <Grid item className={classes.bodyContainer}>
          {/* 달력 연동 기간 텍스트 박스 */}
          <PeriodCompareTextField
            base
            period={baseperiod}
            handleperiod={handleperiod}
          />
          <Paper elevation={0} className={classes.bodyPapper}>
            <Typography className={classes.bodyTitle}>
              <SelectDateIcon className={classes.bodyTitleIcon} />
              <span
                style={{ color: '#2f5fac' }}
                className={classes.bodyTitleHighlite}
              >
                기준 방송
              </span>
              기간 선택
            </Typography>
            {/* 텍스트 박스 연동 기간 선택 달력 */}
            <RangeSelectCaledar
              handleperiod={handleperiod}
              period={baseperiod}
              base
            />
          </Paper>

        </Grid>
        <Typography className={classes.vsText}>
          VS
        </Typography>
        <Grid item className={classes.bodyContainer}>
          {/* 달력 연동 기간 텍스트 박스 */}
          <PeriodCompareTextField
            period={compareperiod}
            handleperiod={handleperiod}
          />
          <Paper elevation={0} className={classes.bodyPapper}>
            <Typography className={classes.bodyTitle}>
              <SelectDateIcon className={classes.bodyTitleIcon} />
              <span className={classes.bodyTitleHighlite}>
                비교 방송
              </span>
              기간 선택
            </Typography>
            {/* 텍스트 박스 연동 기간 선택 달력 */}
            <RangeSelectCaledar
              period={compareperiod}
              handleperiod={handleperiod}
            />
          </Paper>
        </Grid>
      </Grid>

      <Typography className={classes.mainBody} style={{ marginTop: '120px' }}>
        확인할 데이터 선택
      </Typography>
      {/* 분석 옵션 선택 체크박스 그룹 */}
      <CheckBoxGroup
        viewer={checkStateGroup.viewer}
        chat={checkStateGroup.chat}
        smile={checkStateGroup.smile}
        handleCheckStateChange={handleCheckStateChange}
      />

      <Grid container justify="flex-end">
        <Button
          className={classes.anlaysisButton}
          variant="contained"
          onClick={handleAnalysisButton}
          disabled={
            (Object.values(checkStateGroup).indexOf(true) < 0)
            || !(baseperiod[0] && baseperiod[1])
            || !(compareperiod[0] && compareperiod[1])
          }
        >
          분석하기
        </Button>
      </Grid>

    </div>
  );
}
