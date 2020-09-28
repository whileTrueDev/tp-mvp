import React from 'react';
import {
  Typography, Paper, TextField, FormControl, Button,Grid,
  InputLabel, MenuItem, Select, Divider,makeStyles
} from '@material-ui/core';
import { replyData } from '../../pages/AdminSuggest';


interface ReplyEditData{
  state: replyData;
  dispatch: React.Dispatch<any>;
  helpToggle: boolean;
  handleHelpToggle: () => void;
  replyData?: replyData;
}

const useStyles = makeStyles((theme) => ({
  deleteButton: { marginBottom: 5, marginRight: -5}
}))

export default function SuggestReplyEditor(props: ReplyEditData) {
  const {
    state, dispatch, handleHelpToggle, helpToggle, replyData,
  } = props;
  const classes = useStyles();
  return (
    <Paper>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 14 }}>
        <Typography variant="h5">
            기능제안 답변 작성 칸
        </Typography>

        <Button
          style={{ backgroundColor: 'rgb(255, 140, 150, 0.8)', color: '#fff' }}
          onClick={() => { handleHelpToggle(); }}
        >
          마크다운 작성 도움말 보기
        </Button>
      </div>
      <Divider />

      <div style={{ padding: 14 }}>
        <TextField
          id="title-textfield"
          label="제목을 작성하세요."
          variant="outlined"
          style={{ width: '65%', padding: 5 }}
          value={state.title}
          onChange={e => dispatch({ type: 'handleTitle', title: e.target.value })}
          margin="normal"
        />

        <FormControl style={{
          margin: 10,
          minWidth: 120,
        }}
        >
          <InputLabel htmlFor="demo-controlled-open-select">구분</InputLabel>
          <Select
            variant="outlined"
            value={state.categori}
            onChange={e => dispatch({ type: 'handleTopic', topic: e.target.value })}
            inputProps={{
              name: 'age',
              id: 'demo-controlled-open-select',
            }}
          >
            <MenuItem value="기타">기타</MenuItem>
            <MenuItem value="비교분석">비교분석</MenuItem>
            <MenuItem value="편집점분석">편집점분석</MenuItem>
            <MenuItem value="사이트관련">사이트관련</MenuItem>
          </Select>
        </FormControl>

        <TextField
          multiline
          id="contents-textfield"
          label="내용을 마크다운으로 작성하세요."
          variant="outlined"
          rows={24}
          style={{ width: '100%', padding: 5 }}
          onChange={e => dispatch({ type: 'handleContents', contents: e.target.value })}
          margin="normal"
        />
      </div>

      <div style={{ padding: 14, display: 'flex', justifyContent: 'flex-end' }}>
        <Grid container spacing={0}> 
        <Grid item xs={6} lg={4}>
        <Button
            variant="contained"
            color="primary"
            // disabled={!state.contents || !state.title || !state.categori}
            onClick={() => {
              if (window.confirm(`기능제안 답변\n${state.title}\n정말로 답변을 수정하시겠습니까?`)) {
                // noticeUpdate.handleUpdateRequest({
                //   code: noticeData.code,
                //   categori: state.categori,
                //   title: state.title,
                //   status: state.status,
                //   contents: state.contents,
                // });
                 state.isReplied=true;
                 window.location.reload();
              }
            }}
          >
                  해당 답변글 수정
          </Button>
          </Grid> 
          <Grid item xs={6} lg={2}>
            <Button
            className={classes.deleteButton}
            color="secondary"
            variant="contained"
            onClick={() => {
              if (window.confirm(`정말로\n${state.title}\n답변을 삭제하시겠습니까?`)) {
                window.location.reload();
              }
            }}
          >
          답변삭제
        </Button>
        </Grid>
     </Grid> 
      </div>
    </Paper>
  );
}