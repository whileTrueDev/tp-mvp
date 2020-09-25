import React from 'react';
// material-ui core components
import {
  Paper, Typography, Grid, Divider, Button
} from '@material-ui/core';
// axios
import useAxios from 'axios-hooks';
// subcomponents
import RangeSelectCaledar from './RangeSelectCalendar';
import PerioudCompareTextField from './PerioudCompareTextField';
import CheckBoxGroup from './CheckBoxGroup';
// svg icons
import SelectDateIcon from '../../../../atoms/stream-analysis-icons/SelectDateIcon';
// styles
import usePerioudCompareStyles from './PerioudCompareHero.style';

interface PerioudCompareHeroProps {
  userId: string;
}

export default function PerioudCompareHero(props: PerioudCompareHeroProps): JSX.Element {
  const { userId } = props;
  const classes = usePerioudCompareStyles();
  const [basePerioud, setBasePerioud] = React.useState<Date[]>(new Array<Date>(2));
  const [comparePerioud, setComparePerioud] = React.useState<Date[]>(new Array<Date>(2));
  const [checkStateGroup, setCheckStateGroup] = React.useState({
    viewer: false,
    chatCount: false,
    smileCount: false,
    // searchKeyWord: string,
  });

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
        chatCount: false,
        smileCount: false,
        // searchKeyWord: string,
      },
      [event.target.name]: event.target.checked
    });
  };

  const handlePerioud = (startAt: Date, endAt: Date, base?: true) => {
    const per = [startAt, endAt];
    if (base) {
      setBasePerioud(per);
    } else {
      setComparePerioud(per);
    }
  };

  const handleAnalysisButton = () => {
    // 기간 2개 + 분석 항목 (viewer | chatCount | smileCount)
    const selectedProperty = Object.keys(checkStateGroup);
    const anlaysisData = {
      basePerioud,
      comparePerioud,
      condition: selectedProperty[Object.values(checkStateGroup).indexOf(true)]
    };
    console.log(anlaysisData);
    console.log(Object.values(checkStateGroup).indexOf(true));
  };

  return (
    <div className={classes.root}>
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
          <PerioudCompareTextField
            base
            perioud={basePerioud}
            handlePerioud={handlePerioud}
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
              handlePerioud={handlePerioud}
              perioud={basePerioud}
              base
            />
          </Paper>

        </Grid>
        <Typography className={classes.vsText}>
          VS
        </Typography>
        <Grid item className={classes.bodyContainer}>
          {/* 달력 연동 기간 텍스트 박스 */}
          <PerioudCompareTextField
            perioud={comparePerioud}
            handlePerioud={handlePerioud}
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
              perioud={comparePerioud}
              handlePerioud={handlePerioud}
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
        chatCount={checkStateGroup.chatCount}
        smileCount={checkStateGroup.smileCount}
        handleCheckStateChange={handleCheckStateChange}
      />

      <Grid container justify="flex-end">
        <Button
          className={classes.anlaysisButton}
          variant="contained"
          onClick={handleAnalysisButton}
          disabled={
            (Object.values(checkStateGroup).indexOf(true) < 0)
            || !(basePerioud[0] && basePerioud[1])
            || !(comparePerioud[0] && comparePerioud[1])
          }
        >
          분석하기
        </Button>
      </Grid>

    </div>
  );
}
