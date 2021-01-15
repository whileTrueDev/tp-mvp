import React, {
  useMemo, useState, useRef, useCallback,
} from 'react';
import { Button, Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ChannelAnalysisSectionLayout from './ChannelAnalysisSectionLayout';
import VideoListSortField, { FieldType } from './VideoListSortField';
import VideoListPeriodSelector from './VideoListPeriodSelector';
import VideoListTable from './VideoListTable';
import useVideoDataSerach from './useVideoDataSearch';

const useStyles = makeStyles((theme: Theme) => createStyles(
  {
    button: {
      marginTop: theme.spacing(4),
      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
      [theme.breakpoints.up('lg')]: {
        width: '220px',
      },
    },
  },
));

export default function VideoList(): JSX.Element {
  const classes = useStyles();
  const [sortField, setSortField] = useState<FieldType>('date');
  const [period, setPeriod] = useState<Date[]>([new Date('2021-01-01'), new Date('2021-01-10')]);
  const dataPerPage = useRef(5); // 한번에 불러올 데이터 개수
  const [pageNumber, setPageNumber] = useState<number>(0);
  const {
    loading, videos, hasMore,
  } = useVideoDataSerach(pageNumber, period, dataPerPage.current);

  const loadMoreData = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (hasMore) setPageNumber((prevPageNum) => prevPageNum + 1);
  }, [setPageNumber, hasMore]);

  const videoListData = useMemo(() => {
    const videoList = [...videos];

    if (sortField === 'date') {
      videoList.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
    } else {
      videoList.sort((a, b) => b[sortField] - a[sortField]);
    }

    return videoList;
  }, [sortField, videos]);

  const changeSortField = useCallback((event: React.ChangeEvent<{ value: any }>) => {
    setSortField(event.target.value);
  }, [setSortField]);
  return (
    <ChannelAnalysisSectionLayout
      title="동영상 분석"
      description="동영상 분석입니다 동영상 분석 동영상 분석 동영상 분석 동영상 분석 동영상 분석 동영상 분석 동영상 분석 동영상 분석 동영상 분석 동영상 분석 동영상 분석 동영상 분석"
    >

      <VideoListPeriodSelector
        period={period}
        setPeriod={setPeriod}
      />
      <VideoListSortField
        field={sortField}
        handleChange={changeSortField}
      />
      <VideoListTable
        videoList={videoListData}
        loading={loading}
      />
      <Grid container justify="center" alignItems="center">
        <Button
          className={classes.button}
          size="large"
          variant="contained"
          color="secondary"
          disabled={!hasMore}
          onClick={loadMoreData}
        >
          더보기
        </Button>
      </Grid>
    </ChannelAnalysisSectionLayout>
  );
}
