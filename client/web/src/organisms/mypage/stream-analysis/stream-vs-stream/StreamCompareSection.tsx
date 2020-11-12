import React, { useEffect } from 'react';
// material-ui core components
import {
  Typography, Grid, Button, Collapse,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
// shared dtos , interfaces
import { DayStreamsInfo } from '@truepoint/shared/dist/interfaces/DayStreamsInfo.interface';
import { SearchStreamInfoByStreamId } from '@truepoint/shared/dist/dto/stream-analysis/searchStreamInfoByStreamId.dto';
// custom svg icon
import { useSnackbar } from 'notistack';
import SelectDateIcon from '../../../../atoms/stream-analysis-icons/SelectDateIcon';
import SelectVideoIcon from '../../../../atoms/stream-analysis-icons/SelectVideoIcon';
import YoutubeIcon from '../../../../atoms/stream-analysis-icons/YoutubeIcon';
import TwitchIcon from '../../../../atoms/stream-analysis-icons/TwitchIcon';
import AfreecaIcon from '../../../../atoms/stream-analysis-icons/AfreecaIcon';
// sub components
import StreamCalendar from './Calendar';
import StreamCard from './StreamCard';
import StreamList from './StreamList';
import SectionTitle from '../../../shared/sub/SectionTitles';
// style
import useStreamHeroStyles from './StreamCompareSection.style';
// interface
import {
  StreamCompareSectionPropInterface,
} from './StreamCompareSectioninterface';
// attoms
import Loading from '../../../shared/sub/Loading';
// context
import SubscribeContext from '../../../../utils/contexts/SubscribeContext';
// attoms snackbar
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';

export default function StreamCompareSection(
  props: StreamCompareSectionPropInterface,
): JSX.Element {
  const { handleSubmit, loading, error } = props;
  const subscribe = React.useContext(SubscribeContext);
  const classes = useStreamHeroStyles();
  const [dayStreamsList, setDayStreamsList] = React.useState<DayStreamsInfo[]>(
    [],
  );
  const { enqueueSnackbar } = useSnackbar();
  const [clickedDate, setClickedDate] = React.useState<Date>(new Date());
  const [baseStream, setBaseStream] = React.useState<DayStreamsInfo | null>(
    null,
  );
  const [
    compareStream,
    setCompareStream,
  ] = React.useState<DayStreamsInfo | null>(null);
  const [fullMessageOpen, setFullMessageOpen] = React.useState<boolean>(false);

  const handleDayStreamList = (responseList: DayStreamsInfo[]) => {
    setDayStreamsList(responseList);
  };

  const handleSeletedStreams = (
    newStreams: DayStreamsInfo | null,
    base?: true,
  ) => {
    if (base) {
      setBaseStream(newStreams);
    } else {
      setCompareStream(newStreams);
    }
  };

  const handleFullMessage = (isSelectedListFull: boolean) => {
    setFullMessageOpen(isSelectedListFull);
  };

  const handleAnalysisButton = () => {
    // base, compare 존재시 활성화 , 서버 조회 및 연산 요청
    if (baseStream && compareStream) {
      const params: SearchStreamInfoByStreamId = {
        streams: [
          { streamId: baseStream.streamId, platform: baseStream.platform },
          {
            streamId: compareStream.streamId,
            platform: compareStream.platform,
          },
        ],
      };

      handleSubmit(params);
    } else {
      ShowSnack('두 방송을 선택하셔야 분석이 가능합니다.', 'info', enqueueSnackbar);
    }
  };

  /* 네비바 유저 전환시 이전 값 초기화 */
  React.useEffect(() => {
    setBaseStream(null);
    setCompareStream(null);
    setFullMessageOpen(false);
    setClickedDate(new Date());
    setDayStreamsList([]);
  }, [subscribe.currUser]);

  useEffect(() => {
    if (!compareStream || !baseStream) handleFullMessage(false);
  }, [compareStream, baseStream]);

  const platformIcon = (stream: DayStreamsInfo): JSX.Element => {
    switch (stream.platform) {
      case 'afreeca':
        return <AfreecaIcon />;
      case 'twitch':
        return <TwitchIcon />;
      case 'youtube':
        return <YoutubeIcon />;
      default:
        return <div />;
    }
  };

  return (
    <div className={classes.root}>

      {!(error?.isError) && (
        <Loading clickOpen={loading} lodingTime={10000} />
      )}

      <Grid container direction="column" spacing={2}>
        <Grid item>
          <SectionTitle mainTitle="방송별 비교" />
          <Typography className={classes.mainBody}>
            두 방송을 선택하시면 방송 비교 분석을 시작합니다.
          </Typography>
        </Grid>

        {/* 선택된 방송 목록 */}
        <Grid item xs container alignItems="center">
          {/* 리스트 클릭시 base , compare 방송 정보 카드 렌더링 */}
          <Grid item>
            <StreamCard
              stream={baseStream}
              handleSeletedStreams={handleSeletedStreams}
              platformIcon={platformIcon}
              base
            />
          </Grid>

          <Grid item>
            <Typography variant="h6">VS</Typography>
          </Grid>

          <Grid item>
            <StreamCard
              stream={compareStream}
              handleSeletedStreams={handleSeletedStreams}
              platformIcon={platformIcon}
            />
          </Grid>
        </Grid>

        {/* 오류 alert  */}
        {fullMessageOpen && (
        <Grid item xs={6}>
          <Collapse in={fullMessageOpen}>
            <Alert severity="error" className={classes.alert}>
              x 표시를 눌러 삭제후 추가해주세요
            </Alert>
          </Collapse>
        </Grid>
        )}

        {/* 달력 선택 */}
        <Grid item container direction="row">
          <Grid container className={classes.bodyWrapper} style={{ width: 'auto' }}>
            <Grid item style={{ width: '310px' }}>
              <Typography className={classes.bodyTitle}>
                <SelectDateIcon className={classes.selectIcon} />
                날짜 선택
              </Typography>

              {/* Custom Date Picker 달력 컴포넌트 */}
              <div className={classes.calendarAndListWrapper}>
                <StreamCalendar
                  handleDayStreamList={handleDayStreamList}
                  clickedDate={clickedDate}
                  setClickedDate={setClickedDate}
                  baseStream={baseStream}
                  compareStream={compareStream}
                />
              </div>

            </Grid>
            <Grid item className={classes.streamSelectWrapper}>
              <Typography className={classes.bodyTitle}>
                <SelectVideoIcon className={classes.selectIcon} />
                방송 선택
              </Typography>
              {/* 달력 날짜 선택시 해당 날짜 방송 리스트 */}
              <div className={classes.calendarAndListWrapper}>
                <StreamList
                  dayStreamsList={dayStreamsList}
                  baseStream={baseStream}
                  compareStream={compareStream}
                  handleSeletedStreams={handleSeletedStreams}
                  handleFullMessage={handleFullMessage}
                  platformIcon={platformIcon}
                />
              </div>
            </Grid>

          </Grid>
        </Grid>
      </Grid>

      <Grid container justify="center">
        <Button
          variant="contained"
          className={classes.anlaysisButton}
          disabled={!(baseStream && compareStream)}
          onClick={handleAnalysisButton}
        >
          분석하기
        </Button>
      </Grid>
    </div>
  );
}
