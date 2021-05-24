import useAxios from 'axios-hooks';
import React from 'react';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import { useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import CreatorSearchTable from './search/CreatorSearchTable';
import useMediaSize from '../../../utils/hooks/useMediaSize';

export default function CreatorSearch(): JSX.Element {
  const [{ data, loading }] = useAxios<User[]>('/users/id-list');
  const theme = useTheme();
  const { isMobile } = useMediaSize();

  return (
    <div style={{
      width: '100%',
      background: theme.palette.background.paper,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: isMobile ? theme.spacing(6, 2) : theme.spacing(4),
    }}
    >
      {isMobile && <Typography>방송인 검색</Typography>}
      <div style={{ width: '100%' }}>
        <CreatorSearchTable
          data={data}
          loading={loading}
        />
      </div>

    </div>
  );
}
