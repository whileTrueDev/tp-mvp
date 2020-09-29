import React from 'react';
import {
  Typography, Paper, TextField, FormControl, Button,
  InputLabel, MenuItem, Select, Divider,
} from '@material-ui/core';
import { NoticeData } from '../../pages/AdminNotice';


interface NoticeEditData{
  state: NoticeData;
  dispatch: React.Dispatch<any>;
  helpToggle: boolean;
  handleHelpToggle: () => void;
  noticeData?: NoticeData;
}

export default function NoticeEditer(props: NoticeEditData) {
  const {
    state, dispatch, handleHelpToggle, helpToggle, noticeData,
  } = props;

  return (
    <Paper>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 14 }}>
        <Typography variant="h6">
            공지사항 글 작성 칸
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
            <MenuItem value="필독">필독</MenuItem>
            <MenuItem value="공지사항">공지사항</MenuItem>
            <MenuItem value="업데이트">업데이트</MenuItem>
            <MenuItem value="이벤트">이벤트</MenuItem>
            <MenuItem value="시스템 점검">시스템 점검</MenuItem>
            <MenuItem value="결제/계산서/정산">결제/계산서/정산</MenuItem>
          </Select>
        </FormControl>

        <TextField
          multiline
          id="contents-textfield"
          label="내용을 마크다운으로 작성하세요."
          variant="outlined"
          rows={24}
          style={{ width: '100%', padding: 5 }}
          value={state.contents}
          onChange={e => dispatch({ type: 'handleContents', contents: e.target.value })}
          margin="normal"
        />
      </div>

      <div style={{ padding: 14, display: 'flex', justifyContent: 'flex-end' }}>
        {noticeData ? (
          <Button
            variant="contained"
            color="primary"
            disabled={!state.contents || !state.title || !state.categori}
            onClick={() => {
              if (window.confirm(`공지글\n${state.title}\n정말로 수정 하시겠습니까?`)) {
                window.location.reload();
              }
            }}
          >
                  해당 공지사항 수정
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            disabled={!state.contents || !state.title || !state.categori}
            onClick={() => {
              if (window.confirm(`공지글\n${state.title}\n 정말로 업로드 하시겠습니까?`)) {
                window.location.reload();
              }
            }}
          >
                  공지사항 업로드
          </Button>
        )}
      </div>
    </Paper>
  );
}