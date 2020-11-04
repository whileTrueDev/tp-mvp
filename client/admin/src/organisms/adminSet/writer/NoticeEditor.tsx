import React from 'react';
import {
  Typography, Paper, TextField, FormControl, Button,
  InputLabel, MenuItem, Select, Divider, FormGroup, FormControlLabel, Checkbox, CheckboxProps, withStyles,
} from '@material-ui/core';
import useAxios from 'axios-hooks';

interface NoticeEditData{
  state: any;
  dispatch: React.Dispatch<any>;
  // helpToggle: boolean;
  handleHelpToggle: () => void;
  handleReload: () => void;
  noticeData?: any;
}

const ImportantCheckbox = withStyles({
  root: {
    color: '#f5074b',
    '&$checked': {
      color: '#f5074b',
    },
    text: '#f5074b',
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

export default function NoticeEditor(props: NoticeEditData): JSX.Element {
  const {
    state, dispatch, handleHelpToggle, handleReload,
    noticeData,
  } = props;

  const [, executePatch] = useAxios(
    { url: 'http://localhost:3000/admin/notice', method: 'PATCH' }, { manual: true },
  );
  const [, executePost] = useAxios(
    { url: 'http://localhost:3000/admin/notice', method: 'POST' }, { manual: true },
  );

  return (

    <Paper>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 14 }}>
        <Typography variant="h6">
          공지사항 글 작성 칸
        </Typography>

        <Button
          style={{ backgroundColor: 'rgb(255, 140, 150, 0.8)', color: '#fff' }}
          onClick={() => {
            handleHelpToggle();
          }}
        >
          마크다운 작성 도움말 보기
        </Button>
      </div>
      <Divider />
      <div style={{ padding: 14 }}>
        <FormGroup row>
          <TextField
            id="title-textfield"
            label="제목을 작성하세요."
            variant="outlined"
            style={{ width: '65%', padding: 5 }}
            value={state.title}
            onChange={(e) => dispatch({ type: 'handleTitle', title: e.target.value })}
            margin="normal"
          />
          <FormControlLabel
            control={(
              <ImportantCheckbox
                checked={!!(state.isImportant)}
                onChange={(e) => dispatch({ type: 'handleisImportant', isImportant: (!!(e.target.checked)) })}
                name="checkedA"
                color="secondary"
              />
          )}
            label="중요공지"
          />
        </FormGroup>

        <FormControl style={{
          margin: 5,
          minWidth: 120,
        }}
        >
          <InputLabel htmlFor="demo-controlled-open-select">구분</InputLabel>
          <Select
            variant="outlined"
            value={state.category}
            onChange={(e) => dispatch({ type: 'handleCategory', category: e.target.value })}
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
          id="title-textfield"
          label="작성자명 입력"
          variant="outlined"
          style={{ width: '65%', padding: 5 }}
          value={state.author}
          onChange={(e) => dispatch({ type: 'handleAuthor', author: e.target.value })}
          margin="normal"
        />

        <TextField
          multiline
          id="content-textfield"
          label="내용을 마크다운으로 작성하세요."
          variant="outlined"
          rows={24}
          style={{ width: '100%', padding: 5 }}
          value={state.content}
          onChange={(e) => dispatch({ type: 'handleContent', content: e.target.value })}
          margin="normal"
        />
      </div>

      <div style={{ padding: 14, display: 'flex', justifyContent: 'flex-end' }}>
        {noticeData ? (
          <Button
            variant="contained"
            color="primary"
            disabled={!state.content || !state.title || !state.category}
            onClick={() => {
              if (window.confirm(`공지글\n${state.title}\n정말로 수정 하시겠습니까?`)) {
                executePatch({
                  data: {
                    id: state.id,
                    title: state.title,
                    content: state.content,
                    author: state.author,
                    isImportant: state.isImportant,
                    category: state.category,
                  },
                })
                  .then((res) => {
                    handleReload();
                  })
                  .catch((err) => {
                    // 데이터 요청 실패시
                    console.error('err', err.response);
                  });
              }
            }}
          >
            해당 공지사항 수정
          </Button>
        ) : (

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (window.confirm(`공지글\n${state.title}\n 정말로 업로드 하시겠습니까?`)) {
                executePost({
                  data: {
                    id: state.id,
                    title: state.title,
                    content: state.content,
                    author: state.author,
                    isImportant: state.isImportant,
                    category: state.category,
                  },
                })
                  .then((res) => {
                    window.location.reload();
                  })
                  .catch((err) => {
                  // 데이터 요청 실패시
                    console.error('err', err.response);
                  });
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