import React from 'react';
import Table from './Table';
import DownloadButton from './DownloadButton';
import DateTimeDisplay from './DateTimeDisplay';

interface Props extends Record<string, any>{
  data: any[],
}

// 특정 사용자의 편집점 데이터 보여주는 테이블의 컬럼 설정
const UserDataTableColumns = [
  {
    title: '방송제목',
    field: 'title',
  },
  {
    title: '방송날짜 및 시간',
    field: 'dateTime',
    render: (rowData: Record<string, any>) => (<DateTimeDisplay {...rowData} />),
  },
  {
    title: 'csv 다운로드',
    field: 'csv',
    render: (rowData: Record<string, any>) => (<DownloadButton {...rowData} ext="csv" />),
  },
  {
    title: 'srt 다운로드',
    field: 'srt',
    render: (rowData: Record<string, any>) => (<DownloadButton {...rowData} ext="srt" />),
  },
].map((col) => ({ ...col, cellStyle: { textAlign: 'center' } }));

const UserBroadcastTable = (props: Props): JSX.Element => {
  const { data } = props;
  return (
    <Table
      title="편집점 데이터 내려받기"
      data={data}
      columns={UserDataTableColumns}
    />
  );
};
export default UserBroadcastTable;
