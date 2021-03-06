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

/*
AdminAlarm
**********************************************************************************
<개요>
알람에대한 최상위 부모 컴포넌트 입니다.
<백엔드로 요청>
 url: '/users/id-list', method: 'GET'
**********************************************************************************
1. 백엔드로 data get 요청을 보냅니다.
2. UserlistTable과 MessageTable이 위치합니다.
**********************************************************************************
 */
export default function AdminAlarm(): JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedData, setData] = React.useState();
  const [{ data: idList }] = useAxios({
    url: '/users/id-list', method: 'GET',
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
