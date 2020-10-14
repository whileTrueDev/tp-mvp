import React, { useContext, useState } from 'react';
// material-ui core components
import {
  Typography, Grid, Divider, Button,
} from '@material-ui/core';
// subcomponents
import RangeSelectCalendarWithTextfield from './RangeSelectCalendarWithTextfield';
import CheckBoxGroup from './CheckBoxGroup';
// styles
import usePeriodCompareStyles from './PeriodCompareSection.style';
// attoms
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
import ErrorSnackBar from '../../../../atoms/snackbar/ErrorSnackBar';
// contexterLoa
import SubscribeContext from '../../../../utils/contexts/SubscribeContext';
// interface
import { PeriodCompareProps } from './PeriodCompareSection.interface';

export default function PeriodCompareSection(props: PeriodCompareProps): JSX.Element {
  const {
    loading, error, handleSubmit,
  } = props;
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
      ...checkStateGroup,
      [event.target.name]: event.target.checked,
    });
  };

  const handlePeriod = (startAt: Date, endAt: Date, base?: true) => {
    if (base) {
      setBasePeriod([startAt, endAt]);
    } else {
      setComparePeriod([startAt, endAt]);
    }
  };

  /* 네비바 유저 전환시 이전 값 초기화 */
  React.useEffect(() => {
    setBasePeriod(new Array<Date>(2));
    setComparePeriod(new Array<Date>(2));
    setCheckStateGroup({
      viewer: false,
      chat: false,
      smile: false,
    });
  }, [subscribe.currUser]);

  const handleAnalysisButton = () => {
    /* 카테고리 복수 선택 */
    const selectedCategory: string[] = Object
      .entries(checkStateGroup)
      .filter((pair) => pair[1]).map((pair) => pair[0]);

    /* 타겟 유저 아이디 + 기간 2개 요청 */
    handleSubmit({
      category: selectedCategory,
      params: {
        userId: subscribe.currUser.targetUserId,
        baseStartAt: basePeriod[0].toISOString(),
        baseEndAt: basePeriod[1].toISOString(),
        compareStartAt: comparePeriod[0].toISOString(),
        compareEndAt: comparePeriod[1].toISOString(),
      },
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
        <RangeSelectCalendarWithTextfield
          period={basePeriod}
          handlePeriod={handlePeriod}
          base
        />

        <Typography className={classes.vsText}>
          VS
        </Typography>

        <RangeSelectCalendarWithTextfield
          period={comparePeriod}
          handlePeriod={handlePeriod}
        />
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
