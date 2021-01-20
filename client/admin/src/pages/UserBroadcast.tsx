import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import useAxios from 'axios-hooks';
import UserBroadcastTable, { BroadcastDataType } from '../organisms/users/UserBroadcastTable';
import getApiHost from '../util/getApiHost';

const url = `${getApiHost()}/broadcast-info`;

const UserBroadcast = (): JSX.Element => {
  const { userId }: Record<string, any> = useParams();
  const location: Record<string, any> = useLocation();
  const { nickName } = location.state;
  const [{ data, loading }, refetch] = useAxios<BroadcastDataType[]>(`${url}/${userId}`);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div>
      <Typography variant="h4">
        {`${nickName}(${userId})님의 데이터`}
      </Typography>
      <UserBroadcastTable
        data={data}
        loading={loading}
      />
    </div>
  );
};

export default UserBroadcast;
