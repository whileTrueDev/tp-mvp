import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import UserBroadcastTable from '../organisms/users/UserBroadcastTable';

// 더미데이터 형식
interface DummyBroadcastDataType {
  title: string; // 방송제목
  startDate: Date; // 방송날짜및 시간에서 사용
  endDate: Date; // 방송날짜및 시간에서 사용
  csv: string; // csv 파일의 url, 편집점 데이터 다운로드에서 사용
  srt: string;// srt 파일의 url, 편집점 데이터 다운로드에서 사용
}
const dummyBroadcastData: DummyBroadcastDataType[] = [
  {
    title: 'dummydummydummy',
    startDate: new Date(),
    endDate: new Date(),
    csv: 'dummy.csv',
    srt: 'dummy.srt',
  },
];
// 더미데이터 생성
function makeDummyData(i: number) {
  return {
    title: `${i}-dummy`,
    startDate: new Date(),
    endDate: new Date(),
    csv: 'dummy.csv',
    srt: 'dummy.srt',
  };
}
for (let i = 0; i < 20; i += 1) {
  dummyBroadcastData.push(makeDummyData(i));
}

const UserActivity = (): JSX.Element => {
  const { userId }: Record<string, any> = useParams();
  const location: Record<string, any> = useLocation();
  const { nickName } = location.state;
  const [data, setData] = useState<Record<string, any>[]>([]);

  function getUserBroadcastData() {
    // userId로 데이터 가져온 후
    setData(dummyBroadcastData);
  }

  useEffect(() => {
    getUserBroadcastData();
  }, []);

  return (
    <div>
      <Typography variant="h4">
        {`${nickName}(${userId})님의 데이터`}
      </Typography>
      <UserBroadcastTable
        data={data}
      />
    </div>
  );
};

export default UserActivity;
