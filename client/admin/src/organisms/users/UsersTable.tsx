import React from 'react';
import { BriefInfoDataResType, BriefInfoData } from '@truepoint/shared/dist/res/BriefInfoData.interface';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import Table from '../../atoms/Table';

// 'user/:userId'로 페이지 이동시키는 링크 컴포넌트
// 'user/:userId'에서 렌더링되는 UserActivity 컴포넌트에 userName 값을 보냅니다
function NameLink(prop: Record<string, any>): JSX.Element {
  const { userId, nickName, display } = prop;
  // display 가 nickName이면 방송활동명, 
  //            userId이면 id를 표시함
  const content = display === 'nickName' ? nickName : userId;

  return (
    <Link to={{
      pathname: `user/${userId}`,
      state: {
        nickName,
      },
    }}
    >
      {content}
    </Link>
  );
}

// 유저테이블 컬럼 설정
// 각 field 값은 props로 넘어온 data의 key와 일치해야 합니다
const UsersTableColumns = [
  {
    title: '방송활동명',
    field: 'nickName',
    render: (rowData: BriefInfoData) => (<NameLink {...rowData} display="nickName" />),
  },
  {
    title: 'ID',
    field: 'userId',
    render: (rowData: BriefInfoData) => (<NameLink {...rowData} display="userId" />),
  },
  {
    title: '최근 방송 날짜',
    field: 'recentBroadcastDate',
    customSort: (a: BriefInfoData, b: BriefInfoData) => {
      if (!a.recentBroadcastDate) return 1;
      if (!b.recentBroadcastDate) return -1;

      const Adate = new Date(a.recentBroadcastDate).getTime();
      const Bdate = new Date(b.recentBroadcastDate).getTime();

      return Bdate - Adate;
    },
    render: (rowData: BriefInfoData) => {
      if (!rowData.recentBroadcastDate) return '없음';
      return format(new Date(rowData.recentBroadcastDate), 'yyyy/MM/dd HH:mm:ss');
    },
  },
  {
    title: '평균 시청자 수',
    field: 'averageViewer',
    customSort: (a: BriefInfoData, b: BriefInfoData) => a.averageViewer - b.averageViewer,
    render: (rowData: BriefInfoData) => (`${Math.round(rowData.averageViewer)} 명`),
  },
].map((col) => ({
  ...col,
  cellStyle: {
    textAlign: 'center',
    minWidth: '200px',
  },
}));

interface UsersTableProps extends Record<string, any>{
  data: BriefInfoDataResType | undefined,
  loading?: boolean
}

const UsersTable = (props: UsersTableProps): JSX.Element => {
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
