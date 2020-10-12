import React from 'react';
import {
  Typography,  TextField,  Button, Popover,
    Divider,makeStyles, Chip,
} from '@material-ui/core';
import AvatarWithName from './AvatarWithName';
import Skeleton from '@material-ui/lab/Skeleton';
import useAxios from 'axios-hooks';
import shortid from 'shortid';
import { QueryBuilder } from '@material-ui/icons';
import Check from '@material-ui/icons/Check';

interface Props{
  data: any;
  anchorEl: any;
  handleClose:() => void;
}
const useStyles = makeStyles(theme => ({
  container: {
    padding: 12, width: 420,
  },
  field: {
    paddingTop: 5,
    height: 400,
    overflowY: 'auto',
  },
  textContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '95%',
  },
  button: {
    height: 180,
  },
}));

export default function MessageTable(props: Props) {
  
  const { anchorEl, data, handleClose } = props;
  
  const [title, setTitle] = React.useState('');

  const [{data: getData, loading: getLoading}] = useAxios({
    url: 'http://localhost:3000/admin/notification', method: "GET"
  })
  const [{data: postData}, executePost] = useAxios({
    url: 'http://localhost:3000/admin/notification', method: "POST"
  })
  function handleTitle(e: any) {
    setTitle(e.target.value);
  }

  const [content, setContent] = React.useState('');
  
  function handleContent(e: any) {
    setContent(e.target.value);
  }

  const classes = useStyles();

  function handleSendClick() {

    if (title && content) {
      if (window.confirm(`정말로 ${data.userId}에게 메시지를 보내시겠습니까?`)) {
        setTitle('');
        setContent('');
        executePost({
          data : {
            userId : [data.userId],
            title : title,
            content: content,
          }
        })
      }
    } else {
      alert('제목 또는 내용이 없습니다.');
    }
  }

  return (
    <Popover
      id={anchorEl ? 'simple-popover' : undefined}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
  >
    <div className={classes.container}>
      {data && (
        <AvatarWithName name={data.userId} logo={data.logo ? data.logo : null} />
      )}
      <Divider />

      <div className={classes.field}>
        {getLoading && (
          <div>
            <Skeleton width="50%" />
            <Skeleton height={50} />
            <br />
            <Skeleton width="50%" />
            <Skeleton height={50} />
            <br />
            <Skeleton width="50%" />
            <Skeleton height={50} />
            <br />
        </div>
        )}
        {!getLoading && (
           <div>
           {getData.map((message: any) => (
             <div key={shortid.generate()} style={{ marginBottom: 5 }}>
               <div style={{ display: 'flex', alignItems: 'center' }}>
                 <Chip
                   label={new Date(message.createdAt).toLocaleString()}
                   variant="outlined"
                 />
                 {message.readState
                   ? <Check style={{ color: 'rgb(50, 205, 50)', fontSize: 15 }} />
                   : <QueryBuilder style={{ color: '#afafafaf', fontSize: 15 }} />}
               </div>
               <div style={{ padding: 6 }}>
                 <Typography variant="h6">{`${message.title}`}</Typography>
                 <Typography style={{ marginLeft: 20 }}>{`${message.content}`}</Typography>
               </div>
             </div>
           ))}
         </div>
        )}
      </div>
      <Divider />

      <div className={classes.textContainer}>
        <div>
          <TextField
            id="send-message-title"
            label="제목"
            className={classes.textField}
            margin="normal"
            value={title}
            onChange={(e) => { handleTitle(e); }}
          />
          <TextField
            id="send-message-content"
            label="내용"
            className={classes.textField}
            margin="normal"
            multiline
            rows="4"
            value={content}
            onChange={(e) => { handleContent(e); }}
          />
        </div>
        <Button
          color="primary"
          variant="contained"
          className={classes.button}
          onClick={handleSendClick}
        >
          전송
        </Button>
      </div>

    </div>
  </Popover>
  );
}