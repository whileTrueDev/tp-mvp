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
import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';
import { SearchEachS3StreamData } from '@truepoint/shared/dist/dto/stream-analysis/searchS3StreamData.dto';
import { SearchCalendarStreams } from '@truepoint/shared/dist/dto/stream-analysis/searchCalendarStreams.dto';
// styles
import { useSnackbar } from 'notistack';
import classnames from 'classnames';
import usePeriodAnalysisHeroStyle from './PeriodAnalysisSection.style';
import SelectDateIcon from '../../../../atoms/stream-analysis-icons/SelectDateIcon';
// interface
import {
  PeriodAnalysisProps,
  StreamsListItem,
} from '../shared/StreamAnalysisShared.interface';
// attoms
import Loading from '../../../shared/sub/Loading';
import StepGuideTooltip from '../../../../atoms/Tooltip/StepGuideTooltip';
import { stepguideSource } from '../../../../atoms/Tooltip/StepGuideTooltip.text';
// context
import useAuthContext from '../../../../utils/hooks/useAuthContext';

import { dayjsFormatter } from '../../../../utils/dateExpression';

// hooks
import useDialog from '../../../../utils/hooks/useDialog';

// sub shared components
import PeriodSelectBox from '../shared/PeriodSelectBox';
import RangeSelectCalendar from '../shared/RangeSelectCalendar';
import CheckBoxGroup from '../shared/CheckBoxGroup';
import SectionTitle from '../../../shared/sub/SectionTitles';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';
import PeriodSelectDialog from '../shared/PeriodSelectDialog';
import usePublicMainUser from '../../../../store/usePublicMainUser';

export default function PeriodAnalysisSection(props: PeriodAnalysisProps): JSX.Element {
  const {
    loading, error, handleSubmit, exampleMode,
  } = props;
  const classes = usePeriodAnalysisHeroStyle();
  const [period, setPeriod] = React.useState<Date[]>(new Array<Date>(2));
  const [termStreamsList, setTermStreamsList] = React.useState<StreamsListItem[]>([]);
  const [checkStateGroup, setCheckStateGroup] = React.useState({
    viewer: true,
    chatCount: true,
    smileCount: true,
    // searchKeyWord: string,
  });

  // const subscribe = React.useContext(SubscribeContext);
  const auth = useAuthContext(); // 유저 컨텍스트
  const { user } = usePublicMainUser((state) => state); // publicMypage에서 사용할 대체 userId
  const { enqueueSnackbar } = useSnackbar(); // 스낵바 컨텍스트 호출
  const { open, handleClose, handleOpen } = useDialog(); // 다이얼로그 훅

  /**
   * 선택된 기간내의 방송 리스트에 대해 요소를 지우거나 재등록 하는 핸들러
   * @param targetItem 지우거나 재등록 할 요소
   * @param isRemoved 지움 여부 , true -> 지움 , false -> 재등록
   */
  const handleStreamList = (targetItem: StreamsListItem, isRemoved?: boolean) => {
    setTermStreamsList(termStreamsList.map((item) => {
      if (item.streamId === targetItem.streamId) { // 작업할 타겟 요소가 선택된 리스트에 존재 할 경우에 수행
        const newItem = { ...item }; // 타겟 요소 카피

        if (isRemoved === false) newItem.isRemoved = false; // 카피값의 지움 상태값을 인자에 따라 변경
        else newItem.isRemoved = true;

        return newItem; // 변경된 새로운 아이템을 그자리에 바꿔끼움
      }
      return item;
    }));
  };

  /* 체크박스 상태값 핸들러 */
  const handleCheckStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckStateGroup({
      ...checkStateGroup,
      [event.target.name]: event.target.checked,
    });
  };

  /* 달력 기간 선택 상태값 핸들러 */
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
  const [, excuteGetStreams] = useAxios<StreamDataType[]>({
    url: '/broadcast-info',
  }, { manual: true });

  React.useEffect(() => {
    if (period[0] && period[1]) {
      const searchParam: SearchCalendarStreams = {
        userId: exampleMode ? 'sal_gu' : (user.userId || auth.user.userId),
        startDate: period[0].toISOString(),
        endDate: period[1].toISOString(),
      };
      excuteGetStreams({
        params: searchParam,
      }).then((res) => {
        const result = res.data.map((row) => ({
          ...row, isRemoved: false, title: exampleMode ? '예시 방송입니다' : row.title,
        }));
        setTermStreamsList(result);
      }).catch((err) => {
        if (err.response) {
          ShowSnack('방송 정보 구성에 문제가 발생했습니다. 다시 시도해 주세요.', 'error', enqueueSnackbar);
        }
      });
    }
  }, [exampleMode, period, auth.user, user.userId, excuteGetStreams, enqueueSnackbar]);

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

  /**
   * 부모 요소로 부터 받은 방송 분석 요청 버튼 핸들러
   */
  const handleAnalysisButton = () => {
    /* 선택된 기간내 방송 리스트 요소중 지워지지 않은 요소만 요청 */
    const requestParams: SearchEachS3StreamData[] = termStreamsList
      .filter((stream) => !stream.isRemoved)
      .map((dayStreamInfo) => ({
        creatorId: dayStreamInfo.creatorId,
        startedAt: dayjsFormatter(dayStreamInfo.startDate).toISOString(),
        streamId: dayStreamInfo.streamId,
        platform: dayStreamInfo.platform,
        viewer: dayStreamInfo.viewer,
      }));

    /* 체크박스 그룹에 의해 선택된 카테고리만 요청 */
    const selectedCategory: string[] = Object
      .entries(checkStateGroup)
      .filter((pair) => pair[1]).map((pair) => pair[0]);

    if (requestParams.length === 0) {
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
          <Typography variant="body2">
            특정 기간을 선택하면 해당 기간 내의 방송에 대한 분석을 시작합니다.
          </Typography>
          <Typography variant="body2">
            비교할 기간의 시작 날짜와 끝 날짜를 선택해주세요!
          </Typography>
          <Typography color="textSecondary" variant="body2">
            * 데이터 제공 기간을 벗어난 데이터는 확인하실 수 없습니다.
          </Typography>

          <Typography className={classes.mainBody} style={{ fontWeight: 'bold' }}>
            추세 분석을 위한 기간 설정
          </Typography>

          <PeriodSelectBox
            period={period}
            TitleIcon={SelectDateIcon}
            iconProps={{ fontSize: '28px' }}
            titleMessage="기간 선택"
          />

          {/*  기간 선택 부 - 기간 선택 달력 + dialog open 로직 */}
          <div className={classes.calendarWrapper}>
            <RangeSelectCalendar
              exampleMode={exampleMode}
              handlePeriod={handlePeriod}
              period={period}
              handleDialogClose={handleClose}
              handleDialogOpen={handleOpen}
              base
              removeFunc
            />
          </div>

        </Grid>
      </Grid>

      <Grid item>
        { exampleMode ? (
          <StepGuideTooltip
            position="top-start"
            stepTitle="step3"
            content={stepguideSource.mainpagePeriodAnalysis.step3}
          >
            <Typography
              className={classnames({
                [classes.mainBody]: true,
                [classes.categoryTitle]: true,
              })}
            >
              확인할 데이터 선택
            </Typography>
          </StepGuideTooltip>

        ) : (
          <Typography
            className={classnames({
              [classes.mainBody]: true,
              [classes.categoryTitle]: true,
            })}
          >
            확인할 데이터 선택
          </Typography>
        )}
        {/* 분석 항목 선택 체크박스 그룹 */}
        <CheckBoxGroup
          viewer={checkStateGroup.viewer}
          chat={checkStateGroup.chatCount}
          smile={checkStateGroup.smileCount}
          handleCheckStateChange={handleCheckStateChange}
        />
        <Grid container direction="row" justify="center">
          { exampleMode ? (
            <StepGuideTooltip
              position="right"
              stepTitle="step4"
              content={stepguideSource.mainpagePeriodAnalysis.step4}
            >
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
            </StepGuideTooltip>
          ) : (
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
          )}
        </Grid>
      </Grid>

      {termStreamsList && period[0] && period[1] && (
      <PeriodSelectDialog
        open={open}
        period={period}
        selectedStreams={termStreamsList}
        handleStreamList={handleStreamList}
        handleClose={handleClose}
        handlePeriod={handlePeriod}
        base
        exampleMode
      />
      )}

    </Grid>
  );
}
