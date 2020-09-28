import React, { useContext, useState } from 'react';
// material-ui core components
import {
  Paper, Typography, Grid, Divider, Button
} from '@material-ui/core';
// subcomponents
import RangeSelectCaledar from './RangeSelectCalendar';
import PeriodCompareTextField from './PeriodCompareTextField';
import CheckBoxGroup from './CheckBoxGroup';
// svg icons
import SelectDateIcon from '../../../../atoms/stream-analysis-icons/SelectDateIcon';
// styles
import usePeriodCompareStyles from './PeriodCompareSection.style';
// attoms
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
import ErrorSnackBar from '../../../../atoms/snackbar/ErrorSnackBar';
// contexterLoa
import SubscribeContext from '../../../../utils/contexts/SubscribeContext';

export default function PeriodCompareSection(props: any): JSX.Element {
  const { loading, error, handleSubmit } = props;
  const classes = usePeriodCompareStyles();
  const subscribe = useContext(SubscribeContext);
  const [basePeriod, setBasePeriod] = useState<Date[]>(new Array<Date>(2));
  const [comparePeriod, setComparePeriod] = useState<Date[]>(new Array<Date>(2));
  const [checkStateGroup, setCheckStateGroup] = useState({
    viewer: false,
    chat: false,
    smile: false,
  });

  const handleCheckStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckStateGroup({
      ...{
        viewer: false,
        chat: false,
        smile: false,
      },
      [event.target.name]: event.target.checked
    });
  };

  const handlePeriod = (startAt: Date, endAt: Date, base?: true) => {
    const per = [startAt, endAt];
    if (base) {
      setBasePeriod(per);
    } else {
      setComparePeriod(per);
    }
  };

  const handleAnalysisButton = () => {
    // 타겟 유저 아이디 + 기간 2개 + 분석 항목 (viewer | chatCount | smileCount)
    const selectedCategory = Object.keys(checkStateGroup);
    handleSubmit({
      category: [selectedCategory[Object.values(checkStateGroup).indexOf(true)]], // 다중 선택으로 변경시 [] 제거
      params: {
        userId: subscribe.currUser.targetUserId,
        baseStartAt: basePeriod[0].toISOString(),
        baseEndAt: basePeriod[1].toISOString(),
        compareStartAt: comparePeriod[0].toISOString(),
        compareEndAt: comparePeriod[1].toISOString(),
      }
    });
  };

  return (
    <div className={classes.root}>
      {loading
        && <CenterLoading />}
      {error
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
            period={basePeriod}
            handlePeriod={handlePeriod}
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
              handlePeriod={handlePeriod}
              period={basePeriod}
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
            period={comparePeriod}
            handlePeriod={handlePeriod}
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
              period={comparePeriod}
              handlePeriod={handlePeriod}
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
            || !(basePeriod[0] && basePeriod[1])
            || !(comparePeriod[0] && comparePeriod[1])
          }
        >
          분석하기
        </Button>
      </Grid>

    </div>
  );
}
