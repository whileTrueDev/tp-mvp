import React from 'react';
// material-ui core components
import {
  Paper, Typography, Grid, Divider, Button, Collapse
} from '@material-ui/core';
// material-ui leb components
import { Alert } from '@material-ui/lab';
// axios
import useAxios from 'axios-hooks';
// date library
import moment from 'moment';
// styles
import usePerioudAnalysisHeroStyle from './PerioudAnalysisHero.style';
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
  AnaysisStreamsInfo,
  AnaysisStreamsInfoRequest
} from './PerioudAnalysisHero.interface';
// attoms
import CenterLoading from '../../../../atoms/Loading/CenterLoading';

interface PerioudAnalysisHeroProps {
  userId: string;
}

export default function PerioudAnalysisHero(props: PerioudAnalysisHeroProps) : JSX.Element {
  const { userId } = props;
  const classes = usePerioudAnalysisHeroStyle();
  const [perioud, setPerioud] = React.useState<Date[]>(new Array<Date>(2));
  const [termStreamsList, setTermStreamsList] = React.useState<DayStreamsInfo[]>([]);
  const [checkStateGroup, setCheckStateGroup] = React.useState({
    viewer: false,
    chatCount: false,
    smileCount: false,
    // searchKeyWord: string,
  });

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
    setPerioud(per);
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
    }, excuteGetAnalysis] = useAxios<AnaysisStreamsInfo[]>({
      url: 'http://localhost:3000/stream-analysis/streams-term-info',
    }, { manual: true });

  React.useEffect(() => {
    if (perioud[0] && perioud[1]) {
      excuteGetStreams({
        params: {
          userId,
          startDate: perioud[0].toISOString(),
          endDate: perioud[1].toISOString(),
        }
      }).then((res) => { // LOGIN ERROR -> 리다이렉트 필요
        setTermStreamsList(res.data);
      });
    }
  }, [perioud]);

  const handleRemoveIconButton = (removeStream: DayStreamsInfo) => {
    setTermStreamsList(termStreamsList.filter((str) => str.streamId !== removeStream.streamId));
  };

  const handleAnalysisButton = () => {
    const requestParams: AnaysisStreamsInfoRequest[] = termStreamsList.map((dayStreamInfo) => ({
      creatorId: dayStreamInfo.creatorId,
      startedAt: (new Date(dayStreamInfo.startedAt)).toISOString(),
      streamId: dayStreamInfo.streamId
    }));

    console.log(requestParams);

    excuteGetAnalysis({
      // params: {
      //   streams: requestParams
      // }
      params: {
        // streams: [{
        //   creatorId: '203690678',
        //   startedAt: '2020-09-21T00:00:00',
        //   streamId: '39796426622'
        // },
        // {
        //   creatorId: '173881569',
        //   startedAt: '2020-09-22T00:00:00',
        //   streamId: '09221013_09221229_39805658238'
        // },
        // {
        //   creatorId: '175438165',
        //   startedAt: '2020-09-22T00:00:00',
        //   streamId: '39804882894'
        // }]
        streams: requestParams
      }
    }).then((res) => {
      console.log(res);
    });
  };

  return (
    <div className={classes.root}>
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
            in={!(perioud[0] && perioud[1])}
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
                handlePerioud={handlePerioud}
                perioud={perioud}
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
              {getStreamsData && !getStreamsError && !getStreamsLoading ? (
                <StreamList
                  termStreamsList={termStreamsList}
                  handleRemoveIconButton={handleRemoveIconButton}
                />
              ) : (
                <CenterLoading />
              )}

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
            || (!(perioud[0] && perioud[1]))
          }
        >
          분석하기
        </Button>
      </Grid>
    </div>
  );
}
