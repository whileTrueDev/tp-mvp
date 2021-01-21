import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Typography, Box } from '@material-ui/core';
import useAxios from 'axios-hooks';
import { BroadcastDataForDownload } from '@truepoint/shared/dist/interfaces/BroadcastDataForDownload.interface';
import UserBroadcastTable from '../organisms/users/UserBroadcastTable';
import getApiHost from '../util/getApiHost';

const url = `${getApiHost()}/broadcast-info`;

const UserBroadcast = (): JSX.Element => {
  const { userId }: Record<string, any> = useParams();
  const location: Record<string, any> = useLocation();
  const { nickName } = location.state;
  const [{ data, loading }] = useAxios<BroadcastDataForDownload[]>(`${url}/${userId}`);

  return (
    <div>
      <Box p={2}>
        <Typography variant="h5">{`${nickName}(${userId})님의 데이터`}</Typography>
      </Box>
      <UserBroadcastTable
        data={data}
        loading={loading}
      />
    </div>
  );
};

export default UserBroadcast;
