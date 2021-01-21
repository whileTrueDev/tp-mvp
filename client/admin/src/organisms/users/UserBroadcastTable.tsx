import React from 'react';
import { BroadcastDataForDownload } from '@truepoint/shared/dist/interfaces/BroadcastDataForDownload.interface';
import Table from '../../atoms/Table';
import DownloadButton from './DownloadButton';
import DateTimeDisplay from './DateTimeDisplay';

interface TableProps extends Record<string, any>{
  title?: string
  data: BroadcastDataForDownload[] | undefined,
  loading? : boolean
}

// 특정 사용자의 편집점 데이터 보여주는 테이블의 컬럼 설정
const UserDataTableColumns = [
  {
    title: '방송제목',
    field: 'title',
    style: {
      minWidth: '200px',
      width: '400px',
    },
  },
  {
    title: '방송날짜 및 시간',
    field: 'dateTime',
    style: {
      minWidth: '200px',
      width: '200px',
    },
    customSort: (a: BroadcastDataForDownload, b: BroadcastDataForDownload) => {
      // 끝나는 시간 내림차순
      const Adate = new Date(a.endDate).getTime();
      const Bdate = new Date(b.endDate).getTime();
      return Bdate - Adate;
    },
    render: (rowData: BroadcastDataForDownload) => (<DateTimeDisplay {...rowData} />),
  },
  {
    title: 'csv 다운로드',
    field: 'csv',
    style: {
      minWidth: '100px',
      width: '100px',
    },
    sorting: false,
    render: (rowData: BroadcastDataForDownload) => (<DownloadButton {...rowData} ext="csv" />),
  },
  {
    title: 'srt 다운로드',
    field: 'srt',
    style: {
      minWidth: '100px',
      width: '100px',
    },
    sorting: false,
    render: (rowData: BroadcastDataForDownload) => (<DownloadButton {...rowData} ext="srt" />),
  },
].map((col) => ({
  ...col,
  cellStyle: {
    textAlign: 'center',
    ...col.style,
  },
}));

const UserBroadcastTable = (props: TableProps): JSX.Element => {
  const { data, loading, title } = props;
  return (
    <Table
      title={title || '편집점 데이터 내려받기'}
      data={data}
      loading={loading}
      columns={UserDataTableColumns}
    />
  );
};
export default UserBroadcastTable;
