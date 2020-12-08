import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

/* 
  - component 이름 : DashboardDialog
  - component 기능 : 
    1. 메인페이지 dashboard에 진입시, 연동된 채널이없으면 채널연동을 할 수 있도록 유도 
    2. 서비스에 대한 설명을 제공
  - component 내용 : 
    1. truepoint 서비스에대한 설명
    2. mypage/my-office 내정보 설정하기 페이지로 이동하는 버튼
*/

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});
interface DialogProps{

  open: boolean;
  reason: string;
  onClose: (reason: string) => void;
  setOpen: (v: boolean) => void;
}

export default function 다이얼로그입니댜(props: DialogProps): JSX.Element {
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

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} fullWidth maxWidth="sm">
      <DialogTitle id="simple-dialog-title" color="primary">채널 연동을 먼저 설정해주세요!</DialogTitle>
      <List>
        <ListItem autoFocus style={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText />
          <Button color="secondary" onClick={handleClick}>

            <Typography variant="h5" style={{ display: 'flex', justifyItems: 'center', paddingRight: 5 }}>
              "내 정보 관리" 로 바로가기
            </Typography>
            <OpenInNewIcon />
          </Button>
        </ListItem>
      </List>
    </Dialog>
  );
}
