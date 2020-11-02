import React from 'react';
// material-ui core components
import {
  Paper,
  Typography,
  Grid,
  Divider,
  Button,
  Collapse,
} from '@material-ui/core';
// material-ui leb components
import { Alert } from '@material-ui/lab';
// axios
import useAxios from 'axios-hooks';
// shared dtos , interfaces
// import { FindAllStreams } from '@truepoint/shared/dist/dto/stream-analysis/findAllStreams.dto';
import { DayStreamsInfo } from '@truepoint/shared/dist/interfaces/DayStreamsInfo.interface';
import { SearchEachS3StreamData } from '@truepoint/shared/dist/dto/stream-analysis/searchS3StreamData.dto';
import { SearchCalendarStreams } from '@truepoint/shared/dist/dto/stream-analysis/searchCalendarStreams.dto';
// styles
import usePeriodAnalysisHeroStyle from './PeriodAnalysisSection.style';
// custom svg icon
import SelectDateIcon from '../../../../atoms/stream-analysis-icons/SelectDateIcon';
import SelectVideoIcon from '../../../../atoms/stream-analysis-icons/SelectVideoIcon';
// subcomponent
// import RangeSelectCalendar from './RangeSelectCalendar';
import CheckBoxGroup from './CheckBoxGroup';
import StreamList from './StreamList';
// interface
import {
  PeriodAnalysisProps,
  FatalError,
} from './PeriodAnalysisSection.interface';
// attoms
import Loading from '../../../shared/sub/Loading';
import ErrorSnackBar from '../../../../atoms/snackbar/ErrorSnackBar';
// context
import SubscribeContext from '../../../../utils/contexts/SubscribeContext';

export default function PeriodAnalysisSection(
  props: PeriodAnalysisProps,
): JSX.Element {
  const { loading, error, handleSubmit } = props;
  const classes = usePeriodAnalysisHeroStyle();
  const [period, setPeriod] = React.useState<Date[]>(new Array<Date>(2));
  const [termStreamsList, setTermStreamsList] = React.useState<
    DayStreamsInfo[]
  >([]);
  const [checkStateGroup, setCheckStateGroup] = React.useState({
    viewer: false,
    chat: false,
    smile: false,
    // searchKeyWord: string,
  });
  const [innerError, setInnerError] = React.useState<FatalError>({
    isError: false,
    helperText: '',
  });
  const subscribe = React.useContext(SubscribeContext);

  const handleCheckStateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCheckStateGroup({
      ...checkStateGroup,
      [event.target.name]: event.target.checked,
    });
  };

  // const handlePeriod = (startAt: Date, endAt: Date) => {
  //   const _period = {
  //     startAt,
  //     endAt,
  //   };
  //   /* 하루 선택시 이틀로 자동 변경 */
  //   if (_period.endAt.getDate() === _period.startAt.getDate()) {
  //     _period.endAt.setDate(_period.endAt.getDate() + 1);
  //   }
  //   setPeriod([_period.startAt, _period.endAt]);
  // };

  /* 기간 내 존재 모든 방송 리스트 요청 */
  const [, excuteGetStreams] = useAxios<DayStreamsInfo[]>(
    {
      url: '/stream-analysis/stream-list',
    },
    { manual: true },
  );

  React.useEffect(() => {
    if (period[0] && period[1]) {
      const params: SearchCalendarStreams = {
        userId: subscribe.currUser.targetUserId,
        startDate: period[0].toISOString(),
        endDate: period[1].toISOString(),
      };

      excuteGetStreams({
        params,
      })
        .then((res) => {
          // LOGIN ERROR -> 리다이렉트 필요
          setTermStreamsList(res.data);
        })
        .catch((err) => {
          if (err.response) {
            setInnerError({
              isError: true,
              helperText:
                '방송 정보 구성에 문제가 발생했습니다. 다시 시도해 주세요',
            });
          }
        });
    }
  }, [period, subscribe.currUser.targetUserId, excuteGetStreams]);

  /* 네비바 유저 전환시 이전 값 초기화 */
  React.useEffect(() => {
    setPeriod(new Array<Date>(2));
    setCheckStateGroup({
      viewer: false,
      chat: false,
      smile: false,
    });
    setTermStreamsList([]);
  }, [subscribe.currUser]);

  const handleRemoveIconButton = (removeStream: DayStreamsInfo) => {
    setTermStreamsList(
      termStreamsList.filter((str) => str.streamId !== removeStream.streamId),
    );
  };

  const handleAnalysisButton = () => {
    const params: SearchEachS3StreamData[] = termStreamsList.map((dayStreamInfo) => ({
      creatorId: dayStreamInfo.creatorId,
      startedAt: new Date(dayStreamInfo.startedAt).toISOString(),
      streamId: dayStreamInfo.streamId,
    }));

    const selectedCategory: string[] = Object.entries(checkStateGroup)
      .filter((pair) => pair[1])
      .map((pair) => pair[0]);

    if (termStreamsList.length < 1) {
      setInnerError({
        isError: true,
        helperText:
          '기간내에 분석 가능한 방송이 없습니다. 기간을 다시 설정해 주세요',
      });
    } else {
      handleSubmit({
        category: selectedCategory,
        /* request params */
        params,
      });
    }
  };

  const handleError = (newError: FatalError): void => {
    setInnerError({
      isError: newError.isError,
      helperText: newError.helperText,
    });
  };

  return (
    <Grid className={classes.root}>
      <Grid item>
        {(error || innerError.isError) && (
          <ErrorSnackBar
            message={(() => {
              if (error) return error.helperText;
              if (innerError) return innerError.helperText;
              return '알 수 없는 문제가 발생했습니다 다시 시도해주세요.';
            })()}
            closeCallback={() => handleError({ isError: false, helperText: '' })}
          />
        )}
        {!(error || innerError.isError) && (
          <Loading clickOpen={loading} lodingTime={10000} />
        )}

        <Divider className={classes.titleDivider} />
        <Grid container direction="column">
          <Grid item>
            <Typography className={classes.mainTitle}>기간 추세분석</Typography>
            <Typography className={classes.mainBody}>
              추세 분석을 위한 기간 설정
            </Typography>
          </Grid>
          <Grid
            item
            container
            style={{ marginBottom: '5px' }}
            direction="row"
            alignItems="flex-end"
          >
            <Paper elevation={0} className={classes.bodyPapper}>
              <Typography className={classes.subTitle}>
                <SelectDateIcon
                  style={{ fontSize: '32.5px', marginRight: '26px' }}
                />
                날짜 선택
              </Typography>
            </Paper>
            <Collapse
              timeout="auto"
              in={!(period[0] && period[1])}
              style={{ height: 'auto', marginLeft: '20px' }}
            >
              <Alert severity="info" className={classes.alert}>
                기간을 선택하시면 방송 리스트를 확인 할 수 있습니다.
              </Alert>
            </Collapse>
          </Grid>
          <Grid item container direction="row" xs={12}>
            <Grid className={classes.bodyWrapper} container xs={8} item>
              <Grid item xs style={{ width: '310px' }}>
                <Typography className={classes.bodyTitle}>
                  <SelectDateIcon
                    style={{ fontSize: '28.5px', marginRight: '26px' }}
                  />
                  날짜 선택
                </Typography>
                {/* Custom Date Range Picker 달력 컴포넌트 */}
                {/* <RangeSelectCalendar
                  handlePeriod={handlePeriod}
                  period={period}
                  handleError={handleError}
                  base
                /> */}
              </Grid>
              <Grid item xs>
                <Typography className={classes.bodyTitle}>
                  <SelectVideoIcon
                    style={{ fontSize: '28.5px', marginRight: '26px' }}
                  />
                  방송 선택
                </Typography>
                {/* 달력 날짜 선택시 해당 날짜 방송 리스트 */}
                <StreamList
                  termStreamsList={termStreamsList}
                  handleRemoveIconButton={handleRemoveIconButton}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        {/*  날짜 선택시 margin이 달라지는 오류가 발생 */}
        <Typography className={classes.mainBody} style={{ marginTop: '120px' }}>
          확인할 데이터 선택
        </Typography>
        {/* 분석 항목 선택 체크박스 그룹 */}
        <CheckBoxGroup
          viewer={checkStateGroup.viewer}
          chat={checkStateGroup.chat}
          smile={checkStateGroup.smile}
          handleCheckStateChange={handleCheckStateChange}
        />
        <Grid container direction="row" justify="flex-end">
          <Button
            className={classes.anlaysisButton}
            variant="contained"
            onClick={handleAnalysisButton}
            disabled={
              Object.values(checkStateGroup).indexOf(true) < 0
              || !(period[0] && period[1])
            }
          >
            분석하기
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
