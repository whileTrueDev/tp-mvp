import React from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { Box, Button } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import useAxios from 'axios-hooks';
import { BroadcastDataForDownload } from '@truepoint/shared/dist/interfaces/BroadcastDataForDownload.interface';
import UserBroadcastTable from '../organisms/users/UserBroadcastTable';
import getApiHost from '../util/getApiHost';

const url = `${getApiHost()}/broadcast-info`;

const UserBroadcast = (): JSX.Element => {
  const { userId }: Record<string, any> = useParams();
  const location: Record<string, any> = useLocation();
  const history = useHistory();
  const { nickName } = location.state;
  const [{ data, loading }] = useAxios<BroadcastDataForDownload[]>(`${url}/byuser/${userId}`);

  return (
    <div>

      <Box pb={2}>
        <Button variant="contained" color="primary" onClick={history.goBack}>
          <ArrowBackIcon />
          돌아가기
        </Button>
      </Box>
      <UserBroadcastTable
        title={`${nickName}(${userId})님의 데이터`}
        data={data}
        loading={loading}
      />
    </div>
  );
};

export default UserBroadcast;
