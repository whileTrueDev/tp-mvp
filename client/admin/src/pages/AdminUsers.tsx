import React, { useEffect, useState } from 'react';

import UsersTable from '../organisms/users/UsersTable';

// 더미데이터 형식
interface DummyUserDataType {
  nickName: string; // 방송활동명
  userId: string; // ID
  recentBroadcastDate: Date; // 최근방송날짜
  averageViewer: number; // 평균 시청자 수
}
const dummyUserData: DummyUserDataType[] = [
  {
    nickName: 'test',
    userId: 'user',
    recentBroadcastDate: new Date(),
    averageViewer: 0,
  },
];

// 더미데이터 생성
function makeUserData(i: number) {
  return {
    nickName: `test-${i}`,
    userId: `user-${i}`,
    recentBroadcastDate: new Date(),
    averageViewer: Math.ceil(Math.random() * 999999),
  };
}
for (let i = 0; i < 20; i += 1) {
  const userData = makeUserData(i);
  dummyUserData.push(userData);
}

// 더미데이터 형식의 유저 정보를 UserTable에 data로 전달하는 컴포넌트
export default function AdminUsers(): JSX.Element {
  const [data, setData] = useState<Record<string, any>[]>([]);

  function getUserData() {
    // userData 가져온 후
    setData(dummyUserData);
  }

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div>
      <UsersTable data={data} />
    </div>
  );
}
