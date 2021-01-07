import React from 'react';
import {
  Typography, Paper, TextField, FormControl, Button,
  InputLabel, MenuItem, Select, Divider, FormGroup, FormControlLabel, Checkbox, CheckboxProps, withStyles,
} from '@material-ui/core';
import useAxios from 'axios-hooks';

/*
NoticeEditData
**********************************************************************************
NoticeEditor를 위한 props입니다.
**********************************************************************************
state : 공지사항 글에대한 데이터객체입니다.
dispatch : 게시글 작성시 변경사항에대한 추적을 위한 dispatch 함수를 전달받습니다.
handleHelpToggle : 도움말 보기를 띄워주는 핸들러함수를 전달받습니다.
noticeData (optional): 이전 공지사항글 데이터에대한 프롭스를 전달받습니다.
**********************************************************************************
 */
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

/*
NoticeEditor
**********************************************************************************
<개요>
공지사항 글을 작성하는 편집기 컴포넌트 입니다.
<백엔드요청목록>
url: '/notice', method: 'PATCH'
url: '/notice', method: 'POST'
**********************************************************************************
1.작성글에대한 수정, 작성 ui를 만듭니다.
2.백엔드로 작성글에대한 수정, 작성 요청을 보냅니다.
3. noticeData가 있으면 patch가, 없으면 post 모드의 컴포넌트가 만들어집니다.
**********************************************************************************
 */
export default function NoticeEditor(props: NoticeEditData): JSX.Element {
  const {
    state, dispatch, handleHelpToggle, handleReload,
    noticeData,
  } = props;

  const [, executePatch] = useAxios(
    { url: '/notice', method: 'PATCH' }, { manual: true },
  );
  const [, executePost] = useAxios(
    { url: '/notice', method: 'POST' }, { manual: true },
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
          <InputLabel htmlFor="demo-controlled-open-select">카테고리</InputLabel>
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
                    author: 'TruePoint 관리자',
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
            disabled={!state.content || !state.title || !state.category}
            onClick={() => {
              if (window.confirm(`공지글\n${state.title}\n 정말로 업로드 하시겠습니까?`)) {
                executePost({
                  data: {
                    id: state.id,
                    title: state.title,
                    content: state.content,
                    author: 'TruePoint 관리자',
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
