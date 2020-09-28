import React from 'react';
// material-ui core components
import {
  Paper, Typography, Grid, Divider, Button, Collapse
} from '@material-ui/core';
// material-ui leb components
import { Alert } from '@material-ui/lab';
// axios
import useAxios from 'axios-hooks';
// styles
import usePeriodAnalysisHeroStyle from './PeriodAnalysisSection.style';
// custom svg icon
import SelectDateIcon from '../../../../atoms/stream-analysis-icons/SelectDateIcon';
import SelectVideoIcon from '../../../../atoms/stream-analysis-icons/SelectVideoIcon';
// subcomponent
import RangeSelectCalendar from './RangeSelectCalendar';
import CheckBoxGroup from './CheckBoxGroup';
import StreamList from './StreamList';
// interface
import {
  DayStreamsInfo,
  AnaysisStreamsInfoRequest,
  OrganizedData
} from './PeriodAnalysisSection.interface';
// attoms
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
import ErrorSnackBar from '../../../../atoms/snackbar/ErrorSnackBar';
// context
import SubscribeContext from '../../../../utils/contexts/SubscribeContext';

export default function PeriodAnalysisSection() : JSX.Element {
  const classes = usePeriodAnalysisHeroStyle();
  const [period, setPeriod] = React.useState<Date[]>(new Array<Date>(2));
  const [termStreamsList, setTermStreamsList] = React.useState<DayStreamsInfo[]>([]);
  const [checkStateGroup, setCheckStateGroup] = React.useState({
    viewer: false,
    chat: false,
    smile: false,
    // searchKeyWord: string,
  });
  const [anlaysisData, setAnalysisData] = React.useState<OrganizedData>();
  const [snackBar, setSnackBar] = React.useState<boolean>(false);
  const subscribe = React.useContext(SubscribeContext);

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

  const handlePeriod = (startAt: Date, endAt: Date, base?: true) => {
    const per = [startAt, endAt];
    setPeriod(per);
  };

  /* 기간 내 존재 모든 방송 리스트 요청 */
  const [
    {
      data: getStreamsData,
      loading: getStreamsLoading,
      error: getStreamsError
    }, excuteGetStreams] = useAxios<DayStreamsInfo[]>({
      url: 'http://localhost:3000/stream-analysis/stream-list',
    }, { manual: true });

  /* 기간 내 존재 모든 방송 리스트 요청 */
  const [
    {
      data: getAnalysisData,
      loading: getAnalysisLoading,
      error: getAnalysisError
    }, excuteGetAnalysis] = useAxios<OrganizedData>({
      url: 'http://localhost:3000/stream-analysis/streams-term-info',
    }, { manual: true });

  React.useEffect(() => {
    if (period[0] && period[1]) {
      excuteGetStreams({
        params: {
          userId: subscribe.currUser.targetUserId,
          startDate: period[0].toISOString(),
          endDate: period[1].toISOString(),
        },
      }).then((res) => { // LOGIN ERROR -> 리다이렉트 필요
        setTermStreamsList(res.data);
      });
    }
  }, [period]);

  const handleRemoveIconButton = (removeStream: DayStreamsInfo) => {
    setTermStreamsList(termStreamsList.filter((str) => str.streamId !== removeStream.streamId));
  };

  const handleAnalysisButton = () => {
    const requestParams: AnaysisStreamsInfoRequest[] = termStreamsList.map((dayStreamInfo) => ({
      creatorId: dayStreamInfo.creatorId,
      startedAt: (new Date(dayStreamInfo.startedAt)).toISOString(),
      streamId: dayStreamInfo.streamId
    }));

    const selectedCategory = Object.entries(checkStateGroup).filter((state) => state[1] === true);
    if (selectedCategory.length < 1) {
      setSnackBar(true);
    }

    excuteGetAnalysis({
      /* request params */
      params: {
        streams: requestParams,
        category: selectedCategory[0][0]
      }
    }).then((res) => {
      setAnalysisData(res.data);
    }).catch(() => {
      setSnackBar(true);
    });
  };

  return (
    <div className={classes.root}>
      {getAnalysisError
      && (
      <ErrorSnackBar
        message="오류가 발생 했습니다. 다시 시도해주세요."
      />
      )}
      {getAnalysisLoading
      && <CenterLoading />}

      <Divider className={classes.titleDivider} />
      <Grid container direction="column">
        <Grid item>
          <Typography
            className={classes.mainTitle}
          >
            기간 추세분석
          </Typography>
          <Typography
            className={classes.mainBody}
          >
            추세 분석을 위한 기간 설정
          </Typography>
        </Grid>
        <Grid item container style={{ marginBottom: '5px' }} direction="row" alignItems="flex-end">
          <Paper
            elevation={0}
            className={classes.bodyPapper}
          >
            <Typography
              className={classes.subTitle}
            >
              <SelectDateIcon style={{ fontSize: '32.5px', marginRight: '26px' }} />
              날짜 선택
            </Typography>

          </Paper>
          <Collapse
            timeout="auto"
            in={!(period[0] && period[1])}
            style={{ height: 'auto', marginLeft: '20px' }}
          >
            <Alert
              severity="info"
              className={classes.alert}
            >
              기간을 선택하시면 방송 리스트를 확인 할 수 있습니다.
            </Alert>
          </Collapse>
        </Grid>
        <Grid item container direction="row" xs={12}>
          <Grid className={classes.bodyWrapper} container xs={8} item>
            <Grid item xs style={{ width: '310px', }}>
              <Typography
                className={classes.bodyTitle}
              >
                <SelectDateIcon style={{ fontSize: '28.5px', marginRight: '26px' }} />
                날짜 선택
              </Typography>
              {/* Custom Date Range Picker 달력 컴포넌트 */}
              <RangeSelectCalendar
                handlePeriod={handlePeriod}
                period={period}
                base
              />
            </Grid>
            <Grid item xs>
              <Typography
                className={classes.bodyTitle}
              >
                <SelectVideoIcon style={{ fontSize: '28.5px', marginRight: '26px' }} />
                방송 선택
              </Typography>
              {/* 달력 날짜 선택시 해당 날짜 방송 리스트 */}
              <StreamList
                termStreamsList={termStreamsList}
                handleRemoveIconButton={handleRemoveIconButton}
              />
              {(getStreamsError || getStreamsLoading)
                && <CenterLoading />}

            </Grid>
          </Grid>
        </Grid>
      </Grid>

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
      <Grid container justify="flex-end">
        <Button
          className={classes.anlaysisButton}
          variant="contained"
          onClick={handleAnalysisButton}
          disabled={
            (Object.values(checkStateGroup).indexOf(true) < 0)
            || (!(period[0] && period[1]))
          }
        >
          분석하기
        </Button>
      </Grid>
    </div>
  );
}
