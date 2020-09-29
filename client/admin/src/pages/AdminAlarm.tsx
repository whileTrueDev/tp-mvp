import React from 'react';
import { Grid,Typography } from '@material-ui/core';
//organisms
import UserlistTable from '../organisms/alarm_message/Userlist';
import MessageTable from '../organisms/alarm_message/MessageForm';

export interface userData {
  userName: string;
  logo?: string;
}


export const userDataSet: userData[] = [
{
  userName: "박상은",
  logo: "",
},
{
  userName: "박상은",
  logo: ""

},
{
  userName: "박상은",
  logo: ""

},
{
  userName: "박상은",
  logo: ""

},
];


export default function AdminAlarm(){
 
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [data, setData] = React.useState();
  
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
          userData={userDataSet}
          handleClick={handleClick}
          />
     </Grid>

     <Grid item xs={12} lg={6}>
        {anchorEl&&data && (
          <MessageTable
          anchorEl={anchorEl}
          data={data}
          handleClose={handleClose}
          />
        )}
          </Grid>

     </Grid>
    </div>
    );
}