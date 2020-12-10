import React from 'react';
// material-ui core components
import {
  Typography,
  Grid,
  Button,
} from '@material-ui/core';
// axios
import useAxios from 'axios-hooks';
// shared dto and interface
import { DayStreamsInfo } from '@truepoint/shared/dist/interfaces/DayStreamsInfo.interface';
import { SearchEachS3StreamData } from '@truepoint/shared/dist/dto/stream-analysis/searchS3StreamData.dto';
import { SearchCalendarStreams } from '@truepoint/shared/dist/dto/stream-analysis/searchCalendarStreams.dto';
// styles
import { useSnackbar } from 'notistack';
import usePeriodAnalysisHeroStyle from './PeriodAnalysisSection.style';
import SelectDateIcon from '../../../../atoms/stream-analysis-icons/SelectDateIcon';

// interface
import {
  PeriodAnalysisProps,
  StreamsListItem,
} from '../shared/StreamAnalysisShared.interface';
// attoms
import Loading from '../../../shared/sub/Loading';
// context
import useAuthContext from '../../../../utils/hooks/useAuthContext';
// hooks
import useAnchorEl from '../../../../utils/hooks/useAnchorEl';
// sub shared components
import PeriodSelectBox from '../shared/PeriodSelectBox';
import PeriodSelectPopper from '../shared/PeriodSelectPopper';
import RangeSelectCalendar from '../shared/RangeSelectCalendar';
import CheckBoxGroup from '../shared/CheckBoxGroup';
import SectionTitle from '../../../shared/sub/SectionTitles';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';

export default function PeriodAnalysisSection(props: PeriodAnalysisProps): JSX.Element {
  const {
    loading, error, handleSubmit,
  } = props;
  const classes = usePeriodAnalysisHeroStyle();
  const [period, setPeriod] = React.useState<Date[]>(new Array<Date>(2));
  const [termStreamsList, setTermStreamsList] = React.useState<StreamsListItem[]>([]);
  const [checkStateGroup, setCheckStateGroup] = React.useState({
    viewer: true,
    chat: true,
    smile: true,
    // searchKeyWord: string,
  });

  // const subscribe = React.useContext(SubscribeContext);
  const auth = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const {
    anchorEl, handleAnchorClose, handleAnchorOpenWithRef,
  } = useAnchorEl();
  const targetRef = React.useRef<HTMLDivElement | null>(null);

  const handleStreamList = (targetItem: StreamsListItem, isRemoved?: boolean) => {
    setTermStreamsList(termStreamsList.map((item) => {
      if (item.streamId === targetItem.streamId) {
        const newItem = { ...item };

        if (isRemoved === false) newItem.isRemoved = false;
        else newItem.isRemoved = true;

        return newItem;
      }
      return item;
    }));
  };

  const handleCheckStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckStateGroup({
      ...checkStateGroup,
      [event.target.name]: event.target.checked,
    });
  };

  const handlePeriod = (startAt: Date, endAt: Date) => {
    const _period = {
      startAt, endAt,
    };
    /* 하루 선택시 이틀로 자동 변경 */
    if (_period.endAt.getDate() === _period.startAt.getDate()) {
      _period.endAt.setDate(_period.endAt.getDate() + 1);
    }
    setPeriod([_period.startAt, _period.endAt]);
  };

  /* 기간 내 존재 모든 방송 리스트 요청 */
  const [,
    excuteGetStreams] = useAxios<DayStreamsInfo[]>({
      url: '/stream-analysis/stream-list',
    }, { manual: true });

  React.useEffect(() => {
    if (period[0] && period[1]) {
      const params: SearchCalendarStreams = {
        userId: auth.user.userId,
        startDate: period[0].toISOString(),
        endDate: period[1].toISOString(),
      };

      excuteGetStreams({
        params,
      })
        .then((res) => {
          // LOGIN ERROR -> 리다이렉트 필요
          setTermStreamsList(res.data.map((data) => ({
            ...data,
            isRemoved: false,
          })));
        })
        .catch((err) => {
          if (err.response) {
            ShowSnack('방송 정보 구성에 문제가 발생했습니다. 다시 시도해 주세요.', 'error', enqueueSnackbar);
          }
        });
    }
  }, [period, auth.user, excuteGetStreams, enqueueSnackbar]);

  React.useEffect(() => {
    if (period[0] && period[1]) {
      const searchParam: SearchCalendarStreams = {
        userId: auth.user.userId,
        startDate: period[0].toISOString(),
        endDate: period[1].toISOString(),
      };
      excuteGetStreams({
        params: searchParam,
      }).then((res) => { // LOGIN ERROR -> 리다이렉트 필요
        setTermStreamsList(res.data.map((data) => ({
          ...data,
          isRemoved: false,
        })));
      }).catch((err) => {
        if (err.response) {
          ShowSnack('방송 정보 구성에 문제가 발생했습니다. 다시 시도해 주세요.', 'error', enqueueSnackbar);
        }
      });
    }
  }, [period, auth.user, excuteGetStreams, enqueueSnackbar]);

  /* 네비바 유저 전환시 이전 값 초기화 -> CBT 주석 사항 */
  // React.useEffect(() => {
  //   setPeriod(new Array<Date>(2));
  //   setCheckStateGroup({
  //     viewer: false,
  //     chat: false,
  //     smile: false,
  //   });
  //   setTermStreamsList([]);
  // }, [auth.user]);

  const handleAnalysisButton = () => {
    const requestParams: SearchEachS3StreamData[] = termStreamsList
      .filter((stream) => !stream.isRemoved)
      .map((dayStreamInfo) => ({
        creatorId: dayStreamInfo.creatorId,
        startedAt: (new Date(dayStreamInfo.startedAt)).toISOString(),
        streamId: dayStreamInfo.streamId,
        platform: dayStreamInfo.platform,
      }));

    const selectedCategory: string[] = Object
      .entries(checkStateGroup)
      .filter((pair) => pair[1]).map((pair) => pair[0]);

    if (termStreamsList.length < 1) {
      /* 일감 - Alert 수정 하기 에서 수정 */
      ShowSnack('기간내에 분석 가능한 방송이 없습니다. 기간을 다시 설정해 주세요.', 'error', enqueueSnackbar);
    } else {
      handleSubmit({
        category: selectedCategory,
        /* request params */
        params: requestParams,
      });
    }
  };

  return (
    <Grid className={classes.root}>
      <Grid item>
        {!(error && error.isError) && (
          <Loading clickOpen={loading} />
        )}

        <Grid container direction="column">

          <SectionTitle mainTitle="기간 추세 분석" />
          <Typography color="textSecondary" variant="body2">
            특정 기간을 선택하면 해당 기간 내의 방송에 대한 분석을 시작합니다.
          </Typography>
          <Typography color="textSecondary" variant="body2">
            * 데이터 제공 기간을 벗어난 데이터는 확인하실 수 없습니다.
          </Typography>

          <Typography className={classes.mainBody}>
            추세 분석을 위한 기간 설정
          </Typography>

          <PeriodSelectBox
            targetRef={targetRef}
            period={period}
            TitleIcon={SelectDateIcon}
            iconProps={{ fontSize: '28px' }}
            titleMessage="기간 선택"
          />

          {/*  기간 선택 부 - 기간 선택 달력 + popper open 로직 */}
          <div style={{ marginTop: '16px' }}>
            <RangeSelectCalendar
              handlePeriod={handlePeriod}
              period={period}
              base
              anchorEl={anchorEl}
              targetRef={targetRef}
              handleAnchorOpenWithRef={handleAnchorOpenWithRef}
              handleAnchorClose={handleAnchorClose}
            />
          </div>

        </Grid>
      </Grid>

      {anchorEl && (
      <PeriodSelectPopper
        anchorEl={anchorEl}
        period={period}
        handleAnchorClose={handleAnchorClose}
        selectedStreams={termStreamsList}
        base
        handleStreamList={handleStreamList}
      />
      )}
      <Grid item>
        <Typography className={classes.mainBody}>
          확인할 데이터 선택
        </Typography>
        {/* 분석 항목 선택 체크박스 그룹 */}
        <CheckBoxGroup
          viewer={checkStateGroup.viewer}
          chat={checkStateGroup.chat}
          smile={checkStateGroup.smile}
          handleCheckStateChange={handleCheckStateChange}
        />
        <Grid container direction="row" justify="center">
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
      </Grid>
    </Grid>
  );
}
