import useAxios from 'axios-hooks';
import React from 'react';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import { useTheme } from '@material-ui/core/styles';
import CreatorSearchTable from './search/CreatorSearchTable';

export default function CreatorSearch(): JSX.Element {
  const [{ data, loading }] = useAxios<User[]>('/users/id-list');
  const theme = useTheme();

  return (
    <div style={{
      width: '100%',
      background: theme.palette.background.paper,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(4),
    }}
    >
      <div style={{ maxWidth: '1800px', width: '100%' }}>
        <CreatorSearchTable
          data={data}
          loading={loading}
        />
      </div>

    </div>
  );
}
