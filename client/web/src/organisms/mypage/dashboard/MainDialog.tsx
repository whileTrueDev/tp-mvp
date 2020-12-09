import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import { Grid, Paper } from '@material-ui/core';

/* 
  - component 이름 : DashboardDialog
  - component 기능 : 
    1. 메인페이지 dashboard에 진입시, 연동된 채널이없으면 채널연동을 할 수 있도록 유도 
    2. 서비스에 대한 설명을 제공
  - component 내용 : 
    1. truepoint 서비스에대한 설명
    2. mypage/my-office 내정보 설정하기 페이지로 이동하는 버튼
*/

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },

  upper: {
    display: 'flex',
    height: 230,
    paddingTop: 30,
    width: 400,
    backgroundColor: '#929ef8',
  },
  middle1: {
    height: 120,
    width: 400,
    align: 'center',
    backgroundColor: theme.palette.common.white,
  },
  middle2: {
    height: 50,
    width: 400,
    paddingTop: 20,
    align: 'center',
    backgroundColor: theme.palette.common.white,
  },
  low: {
    height: 200,
    width: 400,
    backgroundColor: theme.palette.common.white,
  },
  defalutFont: {
    color: theme.palette.common.black,
    fontWeight: 'bold',
  },
  blueFont: {
    color: '#4b5ac7',
    fontWeight: 'bold',
  },
  moveButton: {
    borderRadius: 0,
    backgroundColor: '#4b5ac7',
    borderColor: '#4b5ac7',
    width: 350,
    height: 70,
    color: theme.palette.common.white,
    boxShadow: 'none',
    fontSize: 20,
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#4b5ac7',
      borderColor: '#4b5ac7',
      boxShadow: 'none',
    },

  },
  shutdownButton: {
    borderRadius: 0,
    color: '#878787',
    width: 350,
    height: 70,
    fontSize: 20,
    fontWeight: 'bold',
  },

}));
interface DialogProps{

  open: boolean;
  reason: string;
  onClose: (reason: string) => void;
  setOpen: (v: boolean) => void;
}

export default function MainDialog(props: DialogProps): JSX.Element {
  const classes = useStyles();
  const {
    onClose, setOpen,
    reason, open,
  } = props;

  const handleClose = () => {
    setOpen(false);
    onClose(reason);
  };
  const handleClick = () => {
    window.location.href = '/mypage/my-office/settings';
  };
  React.useEffect(() => {
    setTimeout(() => {
      setOpen(true);
    },
    500);
  }, []);

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <List disablePadding>
        <ListItem autoFocus className={classes.upper}>
          <Grid container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Grid item>
              <img src="/images/mypageDashboard/dashboardImage.png" alt="dashboardImage" />
            </Grid>
          </Grid>
        </ListItem>

        <ListItem autoFocus className={classes.middle1}>
          <Grid container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Grid item>
              <Typography variant="h5" className={classes.blueFont}>
                지금 방송 채널을 연동

              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" className={classes.defalutFont}>
                하고
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" className={classes.defalutFont}>
                분석을 시작하세요!
              </Typography>
            </Grid>
          </Grid>
        </ListItem>
        <ListItem autoFocus className={classes.middle2}>
          <Grid container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Grid item>
              <Typography variant="subtitle1" className={classes.defalutFont}>
                트루포인트 기능을 정상적으로 사용하기 위해서
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" className={classes.defalutFont}>
                채널 연동을 꼭 진행하셔야 합니다!
              </Typography>
            </Grid>
          </Grid>
        </ListItem>
        <ListItem autoFocus className={classes.low}>
          <Grid container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Grid item style={{ paddingBottom: 20 }}>
              <Button variant="contained" onClick={handleClick} className={classes.moveButton}>채널 연동 하러가기</Button>
            </Grid>
            <Grid item>
              <Paper
                elevation={0}
                style={{
                  borderStyle: 'solid',
                  color: '#878787',
                  backgroundColor: '#ffff',
                  borderRadius: 0,
                  borderWidth: 'thin',
                }}
              >
                <Button variant="outlined" onClick={handleClose} className={classes.shutdownButton}>연동하지 않고 사용하기</Button>
              </Paper>
            </Grid>
          </Grid>
        </ListItem>
      </List>
    </Dialog>
  );
}
