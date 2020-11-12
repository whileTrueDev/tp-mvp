import React from 'react';
import { Grid, Typography } from '@material-ui/core';
// organisms
import useAxios from 'axios-hooks';
import UserlistTable from '../organisms/alarm_message/Userlist';
import MessageTable from '../organisms/alarm_message/MessageForm';

export interface userData {
  userId: string;
  content: string;
  title: string;
  dateform: string;
  createdAt: string;
  readState: boolean;

}

export default function AdminAlarm(): JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedData, setData] = React.useState();
  const [{ data: idList }] = useAxios({
    url: 'http://localhost:3000/users/id-list', method: 'GET',
  });

  const [list, setList] = React.useState<any[]>([{
    userId: '', title: '', content: '', createdAt: '', index: null, readState: false,
  }]);

  React.useEffect((): any => {

    if (idList) {
      const result = idList.map((v: any) => ({
        ...v,
        title: '',
        content: '',
        createdAt: '',
        index: null,
        readState: false,
      }));
      setList(result);
    }
  }, [idList]);


  const handleClick = (event: any, d: any) => {
    setAnchorEl(event.currentTarget);
    setData(d);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <div style={{ padding: 28 }}>
        <Typography variant="h5">
          메시지 보내기
        </Typography>
      </div>
      <Grid container spacing={2}>

        <Grid item xs={12} lg={6}>
          <UserlistTable
            userData={list}
            handleClick={handleClick}
          />
        </Grid>

        <Grid item xs={12} lg={6}>
          {anchorEl && selectedData && (
          <MessageTable
            anchorEl={anchorEl}
            data={selectedData}
            handleClose={handleClose}
          />
          )}
        </Grid>

      </Grid>
    </div>
  );
}
