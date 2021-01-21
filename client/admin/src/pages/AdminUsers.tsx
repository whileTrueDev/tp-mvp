import React, { useEffect } from 'react';
import useAxios from 'axios-hooks';
import { BriefInfoDataResType } from '@truepoint/shared/dist/res/BriefInfoData.interface';
import UsersTable from '../organisms/users/UsersTable';
import getApiHost from '../util/getApiHost';

// 이용자 정보 목록 조회 api주소
const url = `${getApiHost()}/users/brief-info-list`;

export default function AdminUsers(): JSX.Element {
  const [{ data, loading }, refetch] = useAxios<BriefInfoDataResType>(url);

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
