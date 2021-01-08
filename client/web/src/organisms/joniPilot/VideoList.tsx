import React, {
  useMemo, useState, useEffect, useRef,
} from 'react';
import useAxios from 'axios-hooks';
import { Button, Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ChannelAnalysisSectionLayout from './ChannelAnalysisSectionLayout';
import VideoListSortField, { FieldType } from './VideoListSortField';
import VideoListPeriodSelector from './VideoListPeriodSelector';
import VideoListTable, { VideoListItemType } from './VideoListTable';

const url = 'http://localhost:4000/videos';
// json-server 켜기
// npx json-server --watch ./src/pages/joniPilot/data.js --port 4000

const useStyles = makeStyles((theme: Theme) => createStyles(
  {
    button: {
      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
      [theme.breakpoints.up('lg')]: {
        width: '220px',
      },
      backgroundColor: theme.palette.secondary.main,
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
      },
      color: theme.palette.primary.contrastText,
    },
  },
));

const scrollToBottom = () => {
  window.scroll({ top: document.body.offsetHeight, behavior: 'smooth' });
};

export default function VideoList(): JSX.Element {
  const classes = useStyles();
  const [sortField, setSortField] = useState<FieldType>('date');
  const [period, setPeriod] = useState<Date[]>(new Array<Date>(2));
  const dataCount = useRef(5); // 한번에 불러올 데이터 개수
  const [dataWillBeDisplayed, setDataWillBeDisplayed] = useState<VideoListItemType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [{ data, loading, response }] = useAxios({
    url,
    params: {
      _page: page,
      _limit: dataCount.current,
      // startDate_gte: period[0],
      // endDate_lte: period[1],
    },
  });

  const isButtonDisabled = useMemo(() => {
    console.log('useMemo isButtonDisabled');
    if (!response) {
      return false;
    }
    return dataWillBeDisplayed.length === Number(response.headers['x-total-count']);
  }, [dataWillBeDisplayed, response]);

  const loadMoreData = () => {
    console.log('load more data button clicked');
    setPage((p) => p + 1);
  };

  useEffect(() => {
    console.log('use Effect data changed, set Data Willbe displayed');
    if (!data) return;
    setDataWillBeDisplayed((prevData) => prevData.concat(data));
  }, [data]);

  const videoListData = useMemo(() => {
    console.log('videoListdata useMemo');
    if (!dataWillBeDisplayed) return [];
    let filteredData = [...dataWillBeDisplayed];
    // 현재 기간이 선택된 경우 기간별로 필터 
    // -> 기간 부분은 여기서 필터링 할 게 아니라
    // 요청시 param으로 값을 넣어서 처리하도록 바꾸자
    if (period[0] && period[1]) {
      filteredData = filteredData.filter((dataItem) => {
        const dataStartTime = new Date(dataItem.startDate).getTime();
        const dataEndTime = new Date(dataItem.endDate).getTime();
        const periodStartTime = new Date(period[0]).getTime();
        const periodEndTime = new Date(period[1]).getTime();
        return (dataStartTime >= periodStartTime)
              && (dataEndTime <= periodEndTime);
      });
    }
    // 정렬 기준 변경시 다시 정렬
    filteredData.sort((a, b) => {
      if (sortField === 'date') {
        return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
      }
      return b[sortField] - a[sortField];
    });

    return filteredData;
  }, [dataWillBeDisplayed, sortField, period]);

  const changeSortField = (event: React.ChangeEvent<{ value: any }>) => {
    console.log('change sort field');
    setSortField(event.target.value);
  };


  return (
    <ChannelAnalysisSectionLayout title="동영상 분석" tooltip="동영상 분석">
      <VideoListSortField
        field={sortField}
        handleChange={changeSortField}
      />
      <VideoListPeriodSelector
        period={period}
        setPeriod={setPeriod}
      />
      {/* <pre>{JSON.stringify(videoListData, null, 2)}</pre> */}
      <VideoListTable
        videoList={videoListData}
        loading={loading}
      />
      <Grid container justify="center" alignItems="center">
        <Button
          className={classes.button}
          size="large"
          variant="contained"
          disabled={isButtonDisabled}
          onClick={loadMoreData}
        >
          더보기
        </Button>
      </Grid>
    </ChannelAnalysisSectionLayout>
  );
}
