import React from 'react';
import { Grid,Typography } from '@material-ui/core';
//organisms
import UserlistTable from '../organisms/alarm_message/Userlist';
import MessageTable from '../organisms/alarm_message/MessageForm';
import useAxios from 'axios-hooks';

export interface userData {
  userId: string;
}



export default function AdminAlarm(){
 
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedData, setData] = React.useState();

  const [{data}] = useAxios({
    url: 'http://localhost:3000/admin/notification', method: "GET"
  })
  
  const handleClick = (event: any, d: any) => {
    setAnchorEl(event.currentTarget);
    setData(d);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return(
  <div>
    <div style={{ padding: 28 }}>
        <Typography variant="h5">
        메시지 보내기
        </Typography>
      </div>
    <Grid container spacing={2}>

      <Grid item xs={12} lg={6}>
        <UserlistTable
          userData={data}
          handleClick={handleClick}
          />
     </Grid>

     <Grid item xs={12} lg={6}>
        {anchorEl&&data && (
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