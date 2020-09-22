import React from 'react';

// material-ui core components
import {
  Paper, Typography, Grid, Divider, Button, Collapse
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import useAxios from 'axios-hooks';
import moment from 'moment';
import usePerioudAnalysisHeroStyle from './PerioudAnalysisHero.style';
// custom svg icon
import SelectDateIcon from '../../../../atoms/stream-analysis-icons/SelectDateIcon';
import SelectVideoIcon from '../../../../atoms/stream-analysis-icons/SelectVideoIcon';
import RangeSelectCalendar from './RangeSelectCalendar';
import CheckBoxGroup from './CheckBoxGroup';
import StreamList from './StreamList';
import { DayStreamsInfo } from './PerioudAnalysisHero.interface';

export default function PerioudAnalysisHero() : JSX.Element {
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

  const [
    {
      data: getStreamsData,
      loading: getStreamsLoading,
      error: getStreamsError
    }, excuteGetStreams] = useAxios<DayStreamsInfo[]>({
      url: 'http://localhost:3000/stream-analysis/stream-list',
    }, { manual: true });

  React.useEffect(() => {
    if (perioud[0] && perioud[1]) {
      excuteGetStreams({
        params: {
          userId: 'userId1',
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
    console.log(termStreamsList);
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
              <StreamList
                termStreamsList={termStreamsList}
                handleRemoveIconButton={handleRemoveIconButton}
              />
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
