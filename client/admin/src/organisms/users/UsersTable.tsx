import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import Table from './Table';

// 'user/:userId'로 페이지 이동시키는 링크 컴포넌트
// 'user/:userId'에서 렌더링되는 UserActivity 컴포넌트에 userName 값을 보냅니다
function NameLink(prop: any): JSX.Element {
  const { userId, nickName } = prop;
  return (
    <Link to={{
      pathname: `user/${userId}`,
      state: {
        nickName,
      },
    }}
    >
      {nickName}
    </Link>
  );
}

// 유저테이블 컬럼 설정
// 각 field 값은 props로 넘어온 data의 key와 일치해야 합니다
const UsersTableColumns = [
  {
    title: '방송활동명',
    field: 'nickName',
    render: (rowData: Record<string, any>) => (<NameLink {...rowData} />),
  },
  { title: 'ID', field: 'userId' },
  {
    title: '최근 방송 날짜',
    field: 'recentBroadcastDate',
    render: (rowData: Record<string, any>) => (format(new Date(rowData.recentBroadcastDate), 'yyyy-MM-dd')),
  },
  {
    title: '평균 시청자 수',
    field: 'averageViewer',
    render: (rowData: Record<string, any>) => (`${rowData.averageViewer} 명`),
  },
].map((col) => ({ ...col, cellStyle: { textAlign: 'center' } }));

interface Props extends Record<string, any>{
  data: any[],
  loading? : boolean
}
const UsersTable = (props: Props): JSX.Element => {
  const { data, loading } = props;
  return (
    <>
      <Table
        title="이용자 조회"
        columns={UsersTableColumns}
        data={data}
        loading={loading}
      />
    </>
  );
};
export default UsersTable;
