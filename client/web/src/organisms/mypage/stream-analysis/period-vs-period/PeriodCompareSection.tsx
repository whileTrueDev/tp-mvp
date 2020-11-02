import React, { useState } from 'react';
// material-ui core components
import {
  Typography, Grid, Divider, Button,
} from '@material-ui/core';
// axios
import useAxios from 'axios-hooks';
// shared dtos , interfaces
import { DayStreamsInfo } from '@truepoint/shared/dist/interfaces/DayStreamsInfo.interface';
import { SearchStreamInfoByPeriods } from '@truepoint/shared/dist/dto/stream-analysis/searchStreamInfoByPeriods.dto';
import { SearchCalendarStreams } from '@truepoint/shared/dist/dto/stream-analysis/searchCalendarStreams.dto';
// styles
import usePeriodCompareStyles from './PeriodCompareSection.style';
// attoms
import Loading from '../../../shared/sub/Loading';
import ErrorSnackBar from '../../../../atoms/snackbar/ErrorSnackBar';
import SelectVideoIcon from '../../../../atoms/stream-analysis-icons/SelectVideoIcon';
// interfaces
import { PeriodCompareProps, FatalError, StreamsListItem } from '../shared/StreamAnalysisShared.interface';
import useAnchorEl from '../../../../utils/hooks/useAnchorEl';
import useAuthContext from '../../../../utils/hooks/useAuthContext';
// sub shared components
import PeriodSelectBox from '../shared/PeriodSelectBox';
import PeriodSelectPopper from '../shared/PeriodSelectPopper';
import RangeSelectCalendar from '../shared/RangeSelectCalendar';
import CheckBoxGroup from '../shared/CheckBoxGroup';

export default function PeriodCompareSection(props: PeriodCompareProps): JSX.Element {
  const {
    loading, error, handleSubmit,
  } = props;
  const classes = usePeriodCompareStyles();
  // const subscribe = useContext(SubscribeContext);
  const [basePeriod, setBasePeriod] = useState<Date[]>(new Array<Date>(2));
  const [comparePeriod, setComparePeriod] = useState<Date[]>(new Array<Date>(2));
  const [checkStateGroup, setCheckStateGroup] = useState({
    viewer: false,
    chat: false,
    smile: false,
  });
  const [innerError, setInnerError] = React.useState<FatalError>({
    isError: false,
    helperText: '',
  });
  const auth = useAuthContext();
  const baseAnchorEl = useAnchorEl();
  const compareAnchorEl = useAnchorEl();
  const baseTargetRef = React.useRef<HTMLDivElement | null>(null);
  const compareTargetRef = React.useRef<HTMLDivElement | null>(null);

  const [baseStreamsList, setBaseStreamsList] = React.useState<StreamsListItem[]>([]);
  const [compareStreamsList, setCompareStreamsList] = React.useState<StreamsListItem[]>([]);

  /* 기간 내 존재 모든 방송 리스트 요청 */
  const [, excuteGetStreams] = useAxios<DayStreamsInfo[]>({
    url: '/stream-analysis/stream-list',
  }, { manual: true });

  const handleCheckStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckStateGroup({
      ...checkStateGroup,
      [event.target.name]: event.target.checked,
    });
  };

  const handlePeriod = (startAt: Date, endAt: Date, base?: true) => {
    if (base) {
      setBasePeriod([startAt, endAt]);
    } else {
      setComparePeriod([startAt, endAt]);
    }
  };

  const handleBaseStreamList = (targetItem: StreamsListItem, isRemoved?: boolean) => {
    setBaseStreamsList(baseStreamsList.map((item) => {
      if (item.streamId === targetItem.streamId) {
        const newItem = { ...item };

        if (isRemoved === false) newItem.isRemoved = false;
        else newItem.isRemoved = true;

        return newItem;
      }
      return item;
    }));
  };

  const handleCompareStreamList = (targetItem: StreamsListItem, isRemoved?: boolean) => {
    setCompareStreamsList(compareStreamsList.map((item) => {
      if (item.streamId === targetItem.streamId) {
        const newItem = { ...item };

        if (isRemoved === false) newItem.isRemoved = false;
        else newItem.isRemoved = true;

        return newItem;
      }
      return item;
    }));
  };

  /* 네비바 유저 전환시 이전 값 초기화 -> CBT 주석 기능 */
  // React.useEffect(() => {
  //   setBasePeriod(new Array<Date>(2));
  //   setComparePeriod(new Array<Date>(2));
  //   setCheckStateGroup({
  //     viewer: false,
  //     chat: false,
  //     smile: false,
  //   });
  // }, [subscribe.currUser]);

  const handleAnalysisButton = () => {
    /* 카테고리 복수 선택 */
    const selectedCategory: string[] = Object
      .entries(checkStateGroup)
      .filter((pair) => pair[1]).map((pair) => pair[0]);

    /* 타겟 유저 아이디 + 기간 2개 요청 */

    if (selectedCategory.length < 1) {
      setInnerError({
        isError: true,
        helperText: '카테고리를 선택하셔야 분석을 할 수 있습니다.',
      });
    } else {
      const getStreamsParams: SearchCalendarStreams = {
        userId: auth.user.userId,
        startDate: basePeriod[0].toISOString(),
        endDate: basePeriod[1].toISOString(),
      };
      excuteGetStreams({
        params: getStreamsParams,
      }).then((res) => { // LOGIN ERROR -> 리다이렉트 필요
        if (res.data.length > 0) {
          const analysisParam: SearchStreamInfoByPeriods = {
            userId: auth.user.userId,
            baseStartAt: basePeriod[0].toISOString(),
            baseEndAt: basePeriod[1].toISOString(),
            compareStartAt: comparePeriod[0].toISOString(),
            compareEndAt: comparePeriod[1].toISOString(),
          };
          handleSubmit({
            category: selectedCategory,
            params: analysisParam,
          });
        } else {
          setInnerError({
            isError: true,
            helperText: '기준 기간 내 선택된 방송이 없습니다. 기준 기간은 방송을 포함해 기간을 선택해주세요.',
          });
        }
      }).catch(() => {
        setInnerError({
          isError: true,
          helperText: '분석과정에서 오류가 발생했습니다.',
        });
      });
    }
  };

  React.useEffect(() => {
    if (basePeriod[0] && basePeriod[1]) {
      excuteGetStreams({
        params: {
          userId: auth.user.userId,
          startDate: basePeriod[0].toISOString(),
          endDate: basePeriod[1].toISOString(),
        },
      }).then((res) => { // LOGIN ERROR -> 리다이렉트 필요
        setBaseStreamsList(res.data.map((data) => ({
          ...data,
          isRemoved: false,
        })));
      });
    }
  }, [basePeriod, auth.user, excuteGetStreams]);

  React.useEffect(() => {
    if (comparePeriod[0] && comparePeriod[1]) {
      excuteGetStreams({
        params: {
          userId: auth.user.userId,
          startDate: comparePeriod[0].toISOString(),
          endDate: comparePeriod[1].toISOString(),
        },
      }).then((res) => { // LOGIN ERROR -> 리다이렉트 필요
        setCompareStreamsList(res.data.map((data) => ({
          ...data,
          isRemoved: false,
        })));
      });
    }
  }, [comparePeriod, auth.user, excuteGetStreams]);

  const handleError = (newError: FatalError): void => {
    setInnerError({
      isError: newError.isError,
      helperText: newError.helperText,
    });
  };

  return (
    <div className={classes.root}>
      {(error?.isError || innerError.isError)
          && (
          <ErrorSnackBar
            message={(() => {
              if (error) return error.helperText;
              if (innerError) return innerError.helperText;
              return '알 수 없는 문제가 발생했습니다 다시 시도해주세요.';
            })()}
            closeCallback={() => handleError({ isError: false, helperText: '' })}
          />
          )}

      {!(error?.isError || innerError.isError)
          && (
          <Loading
            clickOpen={loading}
            lodingTime={10000}
          />
          )}

      <Divider className={classes.titleDivider} />
      <Typography className={classes.mainTitle}>
        기간 대 기간 분석
      </Typography>
      <Typography className={classes.infoText}>
        * 데이터 제공 기간을 벗어난 데이터는 확인하실 수 없습니다.
      </Typography>
      <Typography className={classes.mainBody} style={{ fontWeight: 500 }}>
        기간별 분석을 위한 기간을 설정해 주세요.
      </Typography>

      <Typography
        className={classes.mainBody}
        style={{ marginTop: '80px' }}
      >
        기간 선택
      </Typography>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Grid container direction="column" style={{ width: 'auto', marginRight: '32px' }}>
          <PeriodSelectBox
            targetRef={baseTargetRef}
            period={basePeriod}
            TitleIcon={SelectVideoIcon}
            iconProps={{
              color: '#3a86ff',
              paddingTop: '5px',
            }}
            titleMessage="기준 기간 선택"
          />

          {/*  기간 선택 부 - 기간 선택 달력 + popper open 로직 */}
          <div style={{ marginTop: '16px' }}>
            <RangeSelectCalendar
              handlePeriod={handlePeriod}
              period={basePeriod}
              base
              anchorEl={baseAnchorEl.anchorEl}
              targetRef={baseTargetRef}
              handleAnchorOpenWithRef={baseAnchorEl.handleAnchorOpenWithRef}
              handleAnchorClose={baseAnchorEl.handleAnchorClose}
              handleError={handleError}
            />
          </div>
        </Grid>

        <Typography
          color="textSecondary"
          style={{
            fontFamily: 'AppleSDGothicNeo',
            fontSize: '30px',
            fontWeight: 'bold',
            paddingTop: '40px',
            marginRight: '32px',
          }}
        >
          VS
        </Typography>

        <Grid container direction="column" style={{ width: 'auto' }}>
          <PeriodSelectBox
            targetRef={compareTargetRef}
            period={comparePeriod}
            TitleIcon={SelectVideoIcon}
            iconProps={{
              color: '#b1ae71',
              paddingTop: '5px',
            }}
            titleMessage="비교 기간 선택"
          />

          {/*  기간 선택 부 - 기간 선택 달력 + popper open 로직 */}
          <div style={{ marginTop: '16px' }}>
            <RangeSelectCalendar
              handlePeriod={handlePeriod}
              period={comparePeriod}
              anchorEl={compareAnchorEl.anchorEl}
              targetRef={compareTargetRef}
              handleAnchorOpenWithRef={compareAnchorEl.handleAnchorOpenWithRef}
              handleAnchorClose={compareAnchorEl.handleAnchorClose}
              handleError={handleError}
            />
          </div>
        </Grid>
      </div>

      {baseAnchorEl.anchorEl && (
      <PeriodSelectPopper
        anchorEl={baseAnchorEl.anchorEl}
        period={basePeriod}
        handleAnchorClose={baseAnchorEl.handleAnchorClose}
        selectedStreams={baseStreamsList}
        base
        handleStreamList={handleBaseStreamList}
      />
      )}

      {compareAnchorEl.anchorEl && (
      <PeriodSelectPopper
        anchorEl={compareAnchorEl.anchorEl}
        period={comparePeriod}
        handleAnchorClose={compareAnchorEl.handleAnchorClose}
        selectedStreams={compareStreamsList}
        handleStreamList={handleCompareStreamList}
      />
      )}

      <Typography className={classes.mainBody} style={{ marginTop: '120px' }}>
        확인할 데이터 선택
      </Typography>

      {/* 분석 옵션 선택 체크박스 그룹 */}
      <CheckBoxGroup
        viewer={checkStateGroup.viewer}
        chat={checkStateGroup.chat}
        smile={checkStateGroup.smile}
        handleCheckStateChange={handleCheckStateChange}
      />

      <Grid container justify="center">
        <Button
          className={classes.anlaysisButton}
          variant="contained"
          onClick={handleAnalysisButton}
          disabled={
            (Object.values(checkStateGroup).indexOf(true) < 0)
            || !(basePeriod[0] && basePeriod[1])
            || !(comparePeriod[0] && comparePeriod[1])
          }
        >
          분석하기
        </Button>
      </Grid>

    </div>
  );
}
