import React from 'react';
import {
  Typography, Paper, TextField, FormControl, Button,
  InputLabel, MenuItem, Select, Divider,
} from '@material-ui/core';
import { SuggestData } from '../../pages/AdminSuggest';


interface SuggestReplyEditData{
  state: SuggestData;
  dispatch: React.Dispatch<any>;
  helpToggle: boolean;
  handleHelpToggle: () => void;
  suggestData?: SuggestData;
}


export default function SuggestReplyEditor(props: SuggestReplyEditData) {
  const {
    state, dispatch, handleHelpToggle, helpToggle, suggestData,
  } = props;
  
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
            value={state.topic}
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
          value={state.contents}
          onChange={e => dispatch({ type: 'handleContents', contents: e.target.value })}
          margin="normal"
        />
      </div>

      <div style={{ padding: 14, display: 'flex', justifyContent: 'flex-end' }}>
        {suggestData ? (
          <Button
            variant="contained"
            color="primary"
            disabled={!state.contents || !state.title || !state.topic}
            onClick={() => {
              if (window.confirm(`기능제안 답변\n${state.title}\n정말로 답변을 수정하시겠습니까?`)) {
                // noticeUpdate.handleUpdateRequest({
                //   code: noticeData.code,
                //   topic: state.topic,
                //   title: state.title,
                //   contents: state.contents,
                // });
                 state.isReplied=true;
                 window.location.reload();
              }
            }}
          >
                  해당 답변글 수정
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            disabled={!state.contents || !state.title || !state.topic}
            onClick={() => {
              if (window.confirm(`답변글\n${state.title}\n 정말로 업로드 하시겠습니까?`)) {
                // noticeUpload.handleUpdateRequest({
                //   topic: state.topic,
                //   title: state.title,
                //   contents: state.contents,
                // });
                state.isReplied = true;
                window.location.reload();
              }
            }}
          >
                  답변 업로드
          </Button>
        )}
      </div>
    </Paper>
  );
}