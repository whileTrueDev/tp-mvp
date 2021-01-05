import React, { useMemo, useState } from 'react';
import useAxios from 'axios-hooks';
import { Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ChannelAnalysisSectionLayout from './ChannelAnalysisSectionLayout';
import VideoListSortField, { FieldType } from './VideoListSortField';
import VideoListPeriodSelector from './VideoListPeriodSelector';
import VideoListTable from './VideoListTable';

const url = 'http://localhost:4000';
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
    },
    box: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
));

export default function VideoList(): JSX.Element {
  const classes = useStyles();
  const [{ data, loading }] = useAxios(`${url}/videos`);
  const [{ data: streamListData }] = useAxios(`${url}/streams`);
  const [sortField, setSortField] = useState<FieldType>('date');
  const [period, setPeriod] = useState<Date[]>(new Array<Date>(2));
  const [videoCount, setVideoCount] = useState<number>(5);

  const videoListData = useMemo(() => {
    if (!data) return [];
    let filteredData = [...data];

    // 기간이 선택된 경우 기간별로 필터
    if (period[0] && period[1]) {
      filteredData = filteredData.filter((dataItem) => {
        const dataStartTime = new Date(dataItem.startDate).getTime();
        const dataEndTime = new Date(dataItem.endDate).getTime();
        const periodStartTime = new Date(period[0]).getTime();
        const periodEndTime = new Date(period[1]).getTime();
        return (dataStartTime >= periodStartTime)
              && (dataEndTime <= periodEndTime);
      });

      setVideoCount(Math.min(data.length, filteredData.length));
    }
    // 정렬 기준 변경시 다시 정렬
    filteredData.sort((a, b) => {
      if (sortField === 'date') {
        return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
      }
      return b[sortField] - a[sortField];
    });

    return filteredData.slice(0, videoCount);
  }, [data, sortField, period, videoCount]);

  // 데이터가 없거나 모든 데이터가 보여진 상태라면 disabled
  const isDisabled = useMemo(() => (
    !data || !videoListData || (data && (data.length <= videoCount))
  ), [data, videoCount, videoListData]);

  const handleChange = (event: React.ChangeEvent<{ value: any }>) => {
    setSortField(event.target.value);
  };

  const loadMoreVideos = () => {
    setVideoCount((prev) => Math.min(data.length, prev + 5));
  };

  // https:// www.smashingmagazine.com/2020/03/sortable-tables-react/
  return (
    <ChannelAnalysisSectionLayout title="동영상 분석" tooltip="동영상 분석">
      <VideoListSortField
        field={sortField}
        handleChange={handleChange}
      />
      <VideoListPeriodSelector
        streams={streamListData || []}
        period={period}
        setPeriod={setPeriod}
      />
      <VideoListTable
        videoList={videoListData}
        loading={loading}
      />
      <div className={classes.box}>
        <Button
          className={classes.button}
          onClick={loadMoreVideos}
          variant="contained"
          color="secondary"
          size="large"
          disabled={isDisabled}
        >
          더보기
        </Button>
      </div>

    </ChannelAnalysisSectionLayout>
  );
}
