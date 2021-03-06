import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Dialog } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import shortid from 'shortid';
import DialogActions from '@material-ui/core/DialogActions';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import ShowSnack from '../snackbar/ShowSnack';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: 12,
    width: '100%',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '95%',
  },
  button: {
    backgroundColor: 'primary',
  },
}));

/*
dataprops
**********************************************************************************
DualMessageForm을 위한 props입니다.
**********************************************************************************
1. list : tabledata props입니다.
2. setList : list를 설정하기위한 props입니다. 
3. handleClose : close를 위한 props입니다.
4. open : component를 open하기 위한 Props입니다.
**********************************************************************************
 */
interface Props{
  list: any[];
  setList: React.Dispatch<React.SetStateAction<any[]>>;
  handleClose(): void;
  open: boolean;
}

/*
DualMessageForm
**********************************************************************************
<개요>
메세지 일괄전송에데한 컴포넌트입니다.
<백엔드로 요청목록>
- url: '/notification', method: 'POST',
**********************************************************************************
1. open 값에따라 다이얼로그 화면이 열립니다.
2. 전달받은 props의 list 에 있는 회원의 목록이 다이얼로그화면에 나열됩니다.
3. 메시지 입력후 전송하기를 누르면 선택된 user정보와 함께 백엔드로 post 요청을 보냅니다.
**********************************************************************************
 */
export default function DualMessageForm(props: Props): JSX.Element {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const {
    list, open, handleClose, setList,
  } = props;

  const [, executePost] = useAxios({
    url: '/notification', method: 'POST',
  }, { manual: true });

  // For text
  const [title, setTitle] = React.useState('');

  function handleTitle(e: any) {
    setTitle(e.target.value);
  }

  const [content, setContent] = React.useState('');

  function handleContent(e: any) {
    setContent(e.target.value);
  }

  function handleSendClick() {
    // 이전 채팅 목록에 현재 보낸 채팅이 추가되어야 함.
    if (title && content) {
      if (window.confirm('정말로 이분들에게 메시지를 보내시겠습니까?')) {
        setTitle('');
        setContent('');
        executePost({
          data: {
            userId: list.map((id: any) => id.id),
            title,
            content,
          },
        });
        handleClose();
      }
    } else {
      ShowSnack('제목 또는 내용이 없습니다.', 'warning', enqueueSnackbar);
    }
  }

  function cancleList(user: any) {
    setList((lst) => lst.filter((chip: any) => chip.id !== user.id));
  }

  return (
    <Dialog
      open={Boolean(open)}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogActions>
        <div>
          <Button
            style={{ marginLeft: 5, marginRight: 5 }}
            variant="contained"
            color="primary"
            onClick={handleSendClick}
          >
            발송
          </Button>
          <Button
            style={{ marginLeft: 5, marginRight: 5 }}
            variant="contained"
            color="secondary"
            onClick={handleClose}
          >
            취소
          </Button>
        </div>
      </DialogActions>
      <div className={classes.container}>
        <h3>발송명단</h3>
        <div style={{ width: '100%', height: 100, overflow: 'auto' }}>
          {list.map((user: any) => (
            <Chip
              label={user.userId}
              variant="outlined"
              key={shortid.generate()}
              onDelete={() => {
                cancleList(user);
              }}
              color="primary"
            />
          ))}
        </div>

        <Divider />
        <div className={classes.textContainer}>
          <TextField
            id="send-message-title"
            label="제목"
            className={classes.textField}
            margin="normal"
            value={title}
            onChange={(e) => {
              handleTitle(e);
            }}
          />
          <TextField
            id="send-message-content"
            label="내용"
            className={classes.textField}
            margin="normal"
            multiline
            rows="4"
            value={content}
            onChange={(e) => {
              handleContent(e);
            }}
          />
        </div>
      </div>
    </Dialog>
  );
}
