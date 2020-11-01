import React from 'react';
// material-ui core components
import {
  Typography, Grid, Divider, Button,
} from '@material-ui/core';
// material-ui leb components
// import { Alert } from '@material-ui/lab';
// axios
import useAxios from 'axios-hooks';
// styles
import usePeriodAnalysisHeroStyle from './PeriodAnalysisSection.style';
// custom svg icon
// import SelectDateIcon from '../../../../atoms/stream-analysis-icons/SelectDateIcon';
// import SelectVideoIcon from '../../../../atoms/stream-analysis-icons/SelectVideoIcon';
// subcomponent
import RangeSelectCaledarTest from './RangeSelectCalendarTest';
import CheckBoxGroup from './CheckBoxGroup';
// import StreamList from './StreamList';
// interface
import {
  DayStreamsInfo,
  PeriodAnalysisProps,
  AnaysisStreamsInfoRequest,
  StreamsListItem,
} from './PeriodAnalysisSection.interface';
// attoms
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
import ErrorSnackBar from '../../../../atoms/snackbar/ErrorSnackBar';
// context
import SubscribeContext from '../../../../utils/contexts/SubscribeContext';
import useAnchorEl from '../../../../utils/hooks/useAnchorEl';
import PeriodSelectBox from './PeriodSelectBox';
import PeriodSelectPopper from './PeriodSelectPopper';

export default function PeriodAnalysisSection(props: PeriodAnalysisProps): JSX.Element {
  const {
    loading, error, handleSubmit,
  } = props;
  const classes = usePeriodAnalysisHeroStyle();
  const [period, setPeriod] = React.useState<Date[]>(new Array<Date>(2));
  const [termStreamsList, setTermStreamsList] = React.useState<StreamsListItem[]>([]);
  const [checkStateGroup, setCheckStateGroup] = React.useState({
    viewer: false,
    chat: false,
    smile: false,
    // searchKeyWord: string,
  });
  const subscribe = React.useContext(SubscribeContext);
  const {
    anchorEl, handleAnchorClose, handleAnchorOpenWithRef,
  } = useAnchorEl();
  const targetRef = React.useRef<HTMLDivElement | null>(null);

  const handleRemoveIconButton = (targetItem: StreamsListItem, isRemoved?: boolean) => {
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
      excuteGetStreams({
        params: {
          userId: subscribe.currUser.targetUserId,
          startDate: period[0].toISOString(),
          endDate: period[1].toISOString(),
        },
      }).then((res) => { // LOGIN ERROR -> 리다이렉트 필요
        setTermStreamsList(res.data.map((data) => ({
          ...data,
          isRemoved: false,
        })));
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

  // const handleRemoveIconButton = (removeStream: DayStreamsInfo) => {
  //   setTermStreamsList(termStreamsList.filter((str) => str.streamId !== removeStream.streamId));
  // };

  const handleAnalysisButton = () => {
    const requestParams: AnaysisStreamsInfoRequest[] = termStreamsList.map((dayStreamInfo) => ({
      creatorId: dayStreamInfo.creatorId,
      startedAt: (new Date(dayStreamInfo.startedAt)).toISOString(),
      streamId: dayStreamInfo.streamId,
    }));

    const selectedCategory: string[] = Object
      .entries(checkStateGroup)
      .filter((pair) => pair[1]).map((pair) => pair[0]);

    // 현재 백엔드로 요청시에 오류남 => 파라미터가 너무 많아서 그런듯, get이 아닌 body를 사용하는 방식?
    if (termStreamsList.length < 1) {
      // alert('기간내에 분석 가능한 방송이 없습니다. 기간을 다시 설정해 주세요');
    } else {
      handleSubmit({
        category: selectedCategory,
        /* request params */
        params: {
          streams: requestParams,
        },
      });
    }
  };

  return (
    <Grid className={classes.root}>
      <Grid item>
        {error
          && (
          <ErrorSnackBar
            message="오류가 발생 했습니다. 다시 시도해주세요."
          />
          )}
        {loading
          && <CenterLoading />}

        <Divider className={classes.titleDivider} />
        <Grid container direction="column">

          <Typography className={classes.mainTitle}>
            기간 추세분석
          </Typography>
          <Typography className={classes.mainBody}>
            추세 분석을 위한 기간 설정
          </Typography>

          <PeriodSelectBox
            targetRef={targetRef}
            period={period}
          />

          {/*  기간 선택 부 - 기간 선택 달력 + popper open 로직 */}
          <div style={{ marginTop: '16px' }}>
            <RangeSelectCaledarTest
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
        handleRemoveIconButton={handleRemoveIconButton}
      />
      )}
      <Grid item>
        <Typography className={classes.mainBody} style={{ marginTop: '70px' }}>
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
