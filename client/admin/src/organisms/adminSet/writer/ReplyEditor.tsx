import React from 'react';
import {
  Typography, Paper, TextField, Button, Grid,
  Divider,
} from '@material-ui/core';
import useAxios from 'axios-hooks';

interface ReplyEditData{
  suggestid?: any;
  replyData?: any;
  state: any;
  dispatch: React.Dispatch<any>;
  handleHelpToggle: () => void;
  handleReplyReload: () => void;
}

export default function SuggestReplyEditor(props: ReplyEditData): JSX.Element {
  const {
    state, dispatch, handleHelpToggle, handleReplyReload, replyData, suggestid,
  } = props;
  const [, executePost] = useAxios(
    { url: 'http://localhost:3000/feature-suggestion/reply', method: 'POST' }, { manual: true },
  );
  const [, executePatch] = useAxios(
    { url: 'http://localhost:3000/feature-suggestion/reply', method: 'PATCH' }, { manual: true },
  );
  const [authorfix, setAuthor] = React.useState('TruePoint');
  function handleAuthorname() {
    setAuthor('TruePoint');
  }
  return (
    <Paper>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 14 }}>
        <Typography variant="h6">
          기능제안 답변작성 칸
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
        <TextField
          id="title-textfield"
          label="작성자명을 작성하세요."
          variant="outlined"
          style={{ width: '65%', padding: 5 }}
          value={authorfix}
          onChange={handleAuthorname}
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
        {replyData ? (
          <Grid container spacing={1}>
            <Grid item xs={6} lg={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (window.confirm('기능제안 답변\n정말로 답변을 수정하시겠습니까?')) {
                    // 백앤드로 업로드
                    executePatch({
                      data: {
                        id: state.replyId,
                        content: state.content,
                        author: authorfix,
                      },
                    })
                      .then((res) => {
                        handleReplyReload();
                      })
                      .catch((err) => {
                      // 데이터 요청 실패시
                        console.error('err', err.response);
                      });
                  }
                }}
              >
                답변수정
              </Button>
            </Grid>
          </Grid>
        )
          : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                if (window.confirm(`공지글\n${state.title}\n 정말로 업로드 하시겠습니까?`)) {
                  executePost({
                    data: {
                      suggestionId: suggestid,
                      content: state.content,
                      author: authorfix,
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
              답변 업로드
            </Button>
          )}
      </div>
    </Paper>
  );
}
