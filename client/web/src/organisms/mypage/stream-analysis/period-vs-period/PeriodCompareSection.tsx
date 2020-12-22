import React, { useState } from 'react';
// material-ui core components
import {
  Typography, Grid, Button,
} from '@material-ui/core';
// axios
import useAxios from 'axios-hooks';
// import moment from 'moment';
// shared dtos , interfaces
import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';
import { SearchStreamInfoByPeriods } from '@truepoint/shared/dist/dto/stream-analysis/searchStreamInfoByPeriods.dto';
import { SearchCalendarStreams } from '@truepoint/shared/dist/dto/stream-analysis/searchCalendarStreams.dto';
// notistack snackbar
import { useSnackbar } from 'notistack';
// styles
import classnames from 'classnames';
import useDialog from '../../../../utils/hooks/useDialog';
import usePeriodCompareStyles from './PeriodCompareSection.style';
// attoms
import Loading from '../../../shared/sub/Loading';
import SelectVideoIcon from '../../../../atoms/stream-analysis-icons/SelectVideoIcon';
// interfaces
import { PeriodCompareProps, StreamsListItem, CompareMetric } from '../shared/StreamAnalysisShared.interface';
import useAuthContext from '../../../../utils/hooks/useAuthContext';
// sub shared components
import PeriodSelectBox from '../shared/PeriodSelectBox';
import RangeSelectCalendar from '../shared/RangeSelectCalendar';
import CheckBoxGroup from '../shared/CheckBoxGroup';
import PeriodSelectDialog from '../shared/PeriodSelectDialog';
// componentShared
import SectionTitle from '../../../shared/sub/SectionTitles';
// attoms snackbar
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';

export default function PeriodCompareSection(props: PeriodCompareProps): JSX.Element {
  const {
    loading, error, handleSubmit,
  } = props;
  const classes = usePeriodCompareStyles();
  // const subscribe = useContext(SubscribeContext);
  const [basePeriod, setBasePeriod] = useState<Date[]>(new Array<Date>(2));
  const [comparePeriod, setComparePeriod] = useState<Date[]>(new Array<Date>(2));
  const [checkStateGroup, setCheckStateGroup] = useState({
    viewer: true,
    chatCount: true,
    smileCount: true,
  });

  const { enqueueSnackbar } = useSnackbar();
  const auth = useAuthContext();

  /* 다이얼로그 */
  const baseDialog = useDialog();
  const compareDialog = useDialog();

  /* 선택된 기간내 방송 목록 state */
  const [baseStreamsList, setBaseStreamsList] = React.useState<StreamsListItem[]>([]);
  const [compareStreamsList, setCompareStreamsList] = React.useState<StreamsListItem[]>([]);

  /* 기간 내 존재 모든 방송 리스트 요청 */
  const [, excuteGetStreams] = useAxios<StreamDataType[]>({
    url: '/broadcast-info',
  }, { manual: true });

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

  const handleBaseStreamList = (targetItem: StreamsListItem, isRemoved?: boolean) => {
    setBaseStreamsList(baseStreamsList.map((item) => {
      if (item.streamId === targetItem.streamId) {
        const newItem = { ...item };

        if (isRemoved === false) newItem.isRemoved = false;
        else newItem.isRemoved = true;

        return newItem;
      }
      return item;
    }));
  };

  const handleCompareStreamList = (targetItem: StreamsListItem, isRemoved?: boolean) => {
    setCompareStreamsList(compareStreamsList.map((item) => {
      if (item.streamId === targetItem.streamId) {
        const newItem = { ...item };

        if (isRemoved === false) newItem.isRemoved = false;
        else newItem.isRemoved = true;

        return newItem;
      }
      return item;
    }));
  };

  /* 네비바 유저 전환시 이전 값 초기화 -> CBT 주석 기능 */
  // React.useEffect(() => {
  //   setBasePeriod(new Array<Date>(2));
  //   setComparePeriod(new Array<Date>(2));
  //   setCheckStateGroup({
  //     viewer: false,
  //     chat: false,
  //     smile: false,
  //   });
  // }, [subscribe.currUser]);

  const handleAnalysisButton = () => {
    /* 카테고리 복수 선택 */
    const selectedCategory: CompareMetric[] = Object
      .entries(checkStateGroup)
      .filter((pair) => pair[1]).map((pair) => pair[0] as CompareMetric);

    /* 타겟 유저 아이디 + 기간 2개 요청 */
    if (selectedCategory.length < 1) {
      ShowSnack('카테고리를 선택해 주세요.', 'info', enqueueSnackbar);
    } else {
      const correctBaseList = baseStreamsList
        .filter((stream) => !stream.isRemoved)
        .map((activeStream) => ({
          ...activeStream,
          startDate: (new Date(activeStream.startDate)).toISOString(),
        }));

      const correctCompareList = compareStreamsList
        .filter((stream) => !stream.isRemoved)
        .map((activeStream) => ({
          ...activeStream,
          startDate: (new Date(activeStream.startDate)).toISOString(),
        }));

      if (correctBaseList.length < 2) {
        ShowSnack('기준 기간 내 선택된 방송이 1개 이하 입니다. 기준 기간은 방송을 2개 이상 포함해 기간을 선택해주세요.', 'error', enqueueSnackbar);
      } else if (correctCompareList.length < 2) {
        ShowSnack('비교 기간 내 선택된 방송이 1개 이하 입니다. 비교 기간은 방송을 2개 이상 포함해 기간을 선택해주세요.', 'error', enqueueSnackbar);
      } else {
        const analysisParam: SearchStreamInfoByPeriods = {
          base: correctBaseList,
          compare: correctCompareList,
        };

        handleSubmit({
          category: selectedCategory,
          params: analysisParam,
        });
      }
    }
  };

  React.useEffect(() => {
    if (basePeriod[0] && basePeriod[1]) {
      const searchParam: SearchCalendarStreams = {
        userId: auth.user.userId,
        startDate: basePeriod[0].toISOString(),
        endDate: basePeriod[1].toISOString(),
      };
      excuteGetStreams({
        params: searchParam,
      }).then((res) => { // LOGIN ERROR -> 리다이렉트 필요
        setBaseStreamsList(res.data.map((data) => ({
          ...data,
          isRemoved: false,
        })));
      }).catch((err) => {
        if (err.response) {
          ShowSnack('방송 정보 구성에 문제가 발생했습니다.', 'error', enqueueSnackbar);
        }
      });
    }
  }, [basePeriod, auth.user, excuteGetStreams, enqueueSnackbar]);

  React.useEffect(() => {
    if (comparePeriod[0] && comparePeriod[1]) {
      const searchParam: SearchCalendarStreams = {
        userId: auth.user.userId,
        startDate: comparePeriod[0].toISOString(),
        endDate: comparePeriod[1].toISOString(),
      };
      excuteGetStreams({
        params: searchParam,
      }).then((res) => { // LOGIN ERROR -> 리다이렉트 필요
        setCompareStreamsList(res.data.map((data) => ({
          ...data,
          isRemoved: false,
        })));
      }).catch((err) => {
        if (err.response) {
          ShowSnack('방송 정보 구성에 문제가 발생했습니다.', 'error', enqueueSnackbar);
        }
      });
    }
  }, [comparePeriod, auth.user, excuteGetStreams, enqueueSnackbar]);

  return (
    <div className={classes.root}>

      {!(error && error.isError) && (<Loading clickOpen={loading} />)}

      <SectionTitle mainTitle="기간대 기간 분석" />
      <Typography color="textSecondary" variant="body2">
        비교할 기간을 선택하면 기간 VS 기간의 방송에 대한 분석을 시작합니다.
      </Typography>
      <Typography color="textSecondary" variant="body2">
        * 데이터 제공 기간을 벗어난 데이터는 확인하실 수 없습니다.
      </Typography>

      <Typography className={classes.mainBody}>
        기간 선택
      </Typography>

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Grid container direction="column" style={{ width: 'auto', marginRight: '32px' }}>
          <PeriodSelectBox
            period={basePeriod}
            TitleIcon={SelectVideoIcon}
            iconProps={{ color: '#3a86ff', paddingTop: '5px' }}
            titleMessage="기준 기간 선택"
          />

          {/*  기간 선택 부 - 기간 선택 달력 + popper open 로직 */}
          <div className={classes.calendarWrapper}>
            <RangeSelectCalendar
              handlePeriod={handlePeriod}
              period={basePeriod}
              handleDialogOpen={baseDialog.handleOpen}
              handleDialogClose={baseDialog.handleClose}
              base
              removeFunc
            />
          </div>
        </Grid>

        <Typography color="textSecondary" className={classes.vsText}>
          VS
        </Typography>

        <Grid container direction="column" style={{ width: 'auto' }}>
          <PeriodSelectBox
            period={comparePeriod}
            TitleIcon={SelectVideoIcon}
            iconProps={{
              color: '#b1ae71',
              paddingTop: '5px',
            }}
            titleMessage="비교 기간 선택"
          />

          {/*  기간 선택 부 - 기간 선택 달력 + popper open 로직 */}
          <div className={classes.calendarWrapper}>
            <RangeSelectCalendar
              handlePeriod={handlePeriod}
              period={comparePeriod}
              handleDialogOpen={compareDialog.handleOpen}
              handleDialogClose={compareDialog.handleClose}
              removeFunc
            />
          </div>
        </Grid>
      </div>

      <Typography
        className={classnames({
          [classes.mainBody]: true,
          [classes.categoryTitle]: true,
        })}
      >
        확인할 데이터 선택
      </Typography>

      {/* 분석 옵션 선택 체크박스 그룹 */}
      <CheckBoxGroup
        viewer={checkStateGroup.viewer}
        chat={checkStateGroup.chatCount}
        smile={checkStateGroup.smileCount}
        handleCheckStateChange={handleCheckStateChange}
      />

      <Grid container justify="center">
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

      {baseStreamsList && basePeriod[0] && basePeriod[1] && (
      <PeriodSelectDialog
        open={baseDialog.open}
        period={basePeriod}
        selectedStreams={baseStreamsList}
        handleStreamList={handleBaseStreamList}
        handleClose={baseDialog.handleClose}
        handlePeriod={handlePeriod}
        base
      />
      )}

      {compareStreamsList && comparePeriod[0] && comparePeriod[1] && (
      <PeriodSelectDialog
        open={compareDialog.open}
        period={comparePeriod}
        selectedStreams={compareStreamsList}
        handleStreamList={handleCompareStreamList}
        handleClose={compareDialog.handleClose}
        handlePeriod={handlePeriod}
      />
      )}
    </div>
  );
}
