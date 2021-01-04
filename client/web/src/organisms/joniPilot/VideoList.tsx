import React, { useMemo, useState } from 'react';
import useAxios from 'axios-hooks';
import ChannelAnalysisSectionLayout from './ChannelAnalysisSectionLayout';
import VideoListSortFieldSelect from './VideoListSortFieldSelect';
import VideoListPeriodSetting from './VideoListPeriodSetting';
import VideoListTable from './VideoListTable';

const url = 'http://localhost:4000/videos';
// json-server 켜기
// npx json-server --watch ./src/pages/joniPilot/data.js --port 4000

export default function VideoList(): JSX.Element {
  const [{ data, loading }] = useAxios(`${url}?_start=0&_limit=20`);
  const [sortField, setSortField] = useState('date');

  // 내림차순 추가하기, 코드 보기 좋게 바꾸기
  const sortedData = useMemo(() => (
    data ? ([...data].sort((a, b) => {
      let ret = 0;
      if (sortField === 'date') {
        ret = new Date(b[sortField]).getTime() - new Date(a[sortField]).getTime();
      } else {
        ret = b[sortField] - a[sortField];
      }
      return ret;
    }))
      : []),
  [data, sortField]);

  const handleChange = (event: React.ChangeEvent<{ value: any }>) => {
    setSortField(event.target.value);
  };

  // VideoListSortFieldSelect 인라인 스타일 제거, class로 스타일하기
  return (
    <div>
      <ChannelAnalysisSectionLayout
        title="동영상 분석"
        tooltip="동영상 분석~~~~"
      >
        <div>
          <div style={{ textAlign: 'right' }}>
            <VideoListSortFieldSelect
              field={sortField}
              handleChange={handleChange}
            />
          </div>
          <VideoListPeriodSetting />
        </div>
      </ChannelAnalysisSectionLayout>
      <VideoListTable
        videoList={sortedData}
        loading={loading}
      />
    </div>
  );
}
