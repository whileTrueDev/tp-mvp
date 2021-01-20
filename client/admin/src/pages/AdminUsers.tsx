import React, { useEffect } from 'react';
import useAxios from 'axios-hooks';
import UsersTable from '../organisms/users/UsersTable';
import getApiHost from '../util/getApiHost';

// // 더미데이터 형식
// interface DummyUserDataType {
//   nickName: string; // 방송활동명
//   userId: string; // ID
//   recentBroadcastDate: Date; // 최근방송날짜
//   averageViewer: number; // 평균 시청자 수
// }

// 이용자 정보 목록 조회 api주소
const url = `${getApiHost()}/users/brief-info-list`;

export default function AdminUsers(): JSX.Element {
  const [{ data, loading }, refetch] = useAxios<any>(url);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div>
      <UsersTable
        data={data}
        loading={loading}
      />
    </div>
  );
}
