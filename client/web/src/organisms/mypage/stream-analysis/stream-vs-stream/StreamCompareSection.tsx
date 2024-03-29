import React, { useEffect } from 'react';
// material-ui core components
import {
  Typography, Grid, Button, Collapse,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
// shared dtos , interfaces
import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';
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
import StepGuideTooltip from '../../../../atoms/Tooltip/StepGuideTooltip';
import { stepguideSource } from '../../../../atoms/Tooltip/StepGuideTooltip.text';
// context
import SubscribeContext from '../../../../utils/contexts/SubscribeContext';
// attoms snackbar
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';

export default function StreamCompareSection(
  props: StreamCompareSectionPropInterface,
): JSX.Element {
  const {
    handleSubmit, loading, error, exampleMode,
  } = props;
  const subscribe = React.useContext(SubscribeContext);
  const classes = useStreamHeroStyles();
  const [dayStreamsList, setDayStreamsList] = React.useState<StreamDataType[]>(
    [],
  );
  const { enqueueSnackbar } = useSnackbar();
  const [clickedDate, setClickedDate] = React.useState<Date>(new Date());
  const [baseStream, setBaseStream] = React.useState<StreamDataType | null>(
    null,
  );
  const [
    compareStream,
    setCompareStream,
  ] = React.useState<StreamDataType | null>(null);
  const [fullMessageOpen, setFullMessageOpen] = React.useState<boolean>(false);

  /*  */
  const handleDayStreamList = (responseList: StreamDataType[]) => {
    setDayStreamsList(responseList);
  };

  /**
   * 기준 방송/ 비교 방송 상태값 변경 핸들러
   * @param newStreams 새롭게 선택한 방송
   * @param base 기준 방송인지에 대한 여부
   */
  const handleSeletedStreams = (
    newStreams: StreamDataType | null,
    base?: true,
  ) => {
    if (base) {
      setBaseStream(newStreams);
    } else {
      setCompareStream(newStreams);
    }
  };

  /**
   * 기준 방송과 비교 방송 모두 차있는 경우 풀 메세지 오픈 핸들러
   * @param isSelectedListFull full 여부
   */
  const handleFullMessage = (isSelectedListFull: boolean) => {
    setFullMessageOpen(isSelectedListFull);
  };

  /**
   * 방송 비교 분석 요청 (부모로부터 받은 요청 버튼 핸들러)
   */
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

  /**
   * 방송 데이터 플랫폼에 따른 아이콘 리턴 함수
   * @param stream 방송 데이터
   */
  const platformIcon = (stream: StreamDataType): JSX.Element => {
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

      {!(error && error.isError) && (
        <Loading clickOpen={loading} />
      )}

      <Grid container direction="column" spacing={2}>
        <Grid item>
          <SectionTitle mainTitle="방송별 비교" />
          <Typography variant="body2" color="textSecondary">
            두 방송을 선택하시면 방송 비교 분석을 시작합니다.
          </Typography>
        </Grid>

        {/* 선택된 방송 목록 */}
        <Grid item xs container alignItems="center" wrap="nowrap">
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
          <Grid container className={classes.bodyWrapper} style={{ minWidth: '700px' }}>
            <Grid item style={{ width: '310px', marginRight: 32 }}>
              <Typography className={classes.bodyTitle}>
                <SelectDateIcon className={classes.selectIcon} />
                날짜 선택
              </Typography>

              {/* Custom Date Picker 달력 컴포넌트 */}
              <div className={classes.calendarAndListWrapper}>
                { exampleMode ? (
                  <StepGuideTooltip
                    position="bottom"
                    stepTitle="step1"
                    content={stepguideSource.mainpageStreamAnalysis.step1}
                  >
                    <StreamCalendar
                      exampleMode={exampleMode}
                      handleDayStreamList={handleDayStreamList}
                      clickedDate={clickedDate}
                      setClickedDate={setClickedDate}
                      baseStream={baseStream}
                      compareStream={compareStream}
                    />
                  </StepGuideTooltip>
                ) : (
                  <StreamCalendar
                    exampleMode={exampleMode}
                    handleDayStreamList={handleDayStreamList}
                    clickedDate={clickedDate}
                    setClickedDate={setClickedDate}
                    baseStream={baseStream}
                    compareStream={compareStream}
                  />
                )}

              </div>

            </Grid>
            <Grid item className={classes.streamSelectWrapper} xs>
              { exampleMode ? (
                <StepGuideTooltip
                  position="top-end"
                  stepTitle="step2"
                  content={stepguideSource.mainpageStreamAnalysis.step2}
                >
                  <Typography className={classes.bodyTitle}>
                    <SelectVideoIcon className={classes.selectIcon} />
                    방송 선택
                  </Typography>
                </StepGuideTooltip>
              ) : (
                <Typography className={classes.bodyTitle}>
                  <SelectVideoIcon className={classes.selectIcon} />
                  방송 선택
                </Typography>
              )}
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
        { exampleMode ? (
          <StepGuideTooltip
            position="right"
            stepTitle="step3"
            content={stepguideSource.mainpageStreamAnalysis.step3}
          >
            <Button
              variant="contained"
              className={classes.anlaysisButton}
              disabled={!(baseStream && compareStream)}
              onClick={handleAnalysisButton}
            >
              분석하기
            </Button>
          </StepGuideTooltip>
        ) : (
          <Button
            variant="contained"
            className={classes.anlaysisButton}
            disabled={!(baseStream && compareStream)}
            onClick={handleAnalysisButton}
          >
            분석하기
          </Button>
        )}
      </Grid>
    </div>
  );
}
