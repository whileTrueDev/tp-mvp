import React, { useEffect } from 'react';
// material-ui core components
import {
  Typography, Grid, Divider, Button, Collapse,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
// shared dtos , interfaces
// import { FindAllStreams } from '@truepoint/shared/dist/dto/stream-analysis/findAllStreams.dto';
import { DayStreamsInfo } from '@truepoint/shared/dist/interfaces/DayStreamsInfo.interface';
import { SearchStreamInfoByStreamId } from '@truepoint/shared/dist/dto/stream-analysis/searchStreamInfoByStreamId.dto';
// custom svg icon
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
  FatalError,
} from './StreamCompareSectioninterface';
// attoms
import Loading from '../../../shared/sub/Loading';
import ErrorSnackBar from '../../../../atoms/snackbar/ErrorSnackBar';
// context
import SubscribeContext from '../../../../utils/contexts/SubscribeContext';

export default function StreamCompareSection(
  props: StreamCompareSectionPropInterface,
): JSX.Element {
  const { handleSubmit, loading, error } = props;
  const subscribe = React.useContext(SubscribeContext);
  const classes = useStreamHeroStyles();
  const [dayStreamsList, setDayStreamsList] = React.useState<DayStreamsInfo[]>(
    [],
  );
  const [clickedDate, setClickedDate] = React.useState<Date>(new Date());
  const [baseStream, setBaseStream] = React.useState<DayStreamsInfo | null>(
    null,
  );
  const [
    compareStream,
    setCompareStream,
  ] = React.useState<DayStreamsInfo | null>(null);
  const [fullMessageOpen, setFullMessageOpen] = React.useState<boolean>(false);
  const [innerError, setInnerError] = React.useState<FatalError>({
    isError: false,
    helperText: '',
  });

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
      setInnerError({
        helperText: '두 방송을 선택하셔야 분석이 가능합니다.',
        isError: true,
      });
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
        return <AfreecaIcon style={{ marginRight: '10px' }} />;
      case 'twitch':
        return <TwitchIcon style={{ marginRight: '10px' }} />;
      case 'youtube':
        return <YoutubeIcon style={{ marginRight: '10px' }} />;
      default:
        return <div />;
    }
  };

  const handleError = (newError: FatalError): void => {
    setInnerError({
      isError: newError.isError,
      helperText: newError.helperText,
    });
  };

  return (
    <div className={classes.root}>
      {(error?.isError || innerError.isError) && (
        // 여러 복합 에러 배열 형태로 적용 가능하게 변경 필요
        <ErrorSnackBar
          message={(() => {
            if (error) return error.helperText;
            if (innerError) return innerError.helperText;
            return '알 수 없는 문제가 발생했습니다 다시 시도해주세요.';
          })()}
          closeCallback={() => handleError({ isError: false, helperText: '' })}
        />
      )}

      {!(error?.isError || innerError.isError) && (
        <Loading clickOpen={loading} lodingTime={10000} />
      )}

      <Grid container direction="column">
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
        <Grid item container direction="row" xs={12}>
          <Grid className={classes.bodyWrapper} container xs={8} item>
            <Grid item xs style={{ width: '310px' }}>
              <Typography className={classes.bodyTitle}>
                <SelectDateIcon
                  style={{ fontSize: '28.5px', marginRight: '26px' }}
                />
                날짜 선택
              </Typography>
              {/* Custom Date Picker 달력 컴포넌트 */}

              <StreamCalendar
                handleDayStreamList={handleDayStreamList}
                clickedDate={clickedDate}
                setClickedDate={setClickedDate}
                baseStream={baseStream}
                compareStream={compareStream}
                handleError={handleError}
              />
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
                dayStreamsList={dayStreamsList}
                baseStream={baseStream}
                compareStream={compareStream}
                handleSeletedStreams={handleSeletedStreams}
                handleFullMessage={handleFullMessage}
                platformIcon={platformIcon}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container justify="flex-end">
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
