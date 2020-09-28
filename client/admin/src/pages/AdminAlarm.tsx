import React from 'react';
import {makeStyles, Grid} from '@material-ui/core';
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
  <div style={{ marginTop: 48 }}>
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