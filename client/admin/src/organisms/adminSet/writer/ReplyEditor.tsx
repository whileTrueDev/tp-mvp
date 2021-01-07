import React from 'react';
import {
  Typography, Paper, TextField, Button, Grid,
  Divider,
} from '@material-ui/core';
import useAxios from 'axios-hooks';

/*
ReplyEditData
**********************************************************************************
SuggestReplyEditor를 위한 props입니다.
**********************************************************************************
suggestid (optional) : 기능제안 글의 id를 전달받는 속성값입니다.
replyData (optional) : 답변글에대한 데이터를 전달받는 속성값입니다.
state : 답변글 데이터를 post하기위한 속성값입니다.
dispatch : 게시글 작성시 변경사항에대한 추적을 위한 dispatch 함수를 전달받습니다.
handleHelpToggle : 도움말 보기를 띄워주는 핸들러함수를 전달받습니다.
handleReplyReload : 답변글목록에 변경사항을 랜더링하기위한 핸들러함수를 전달받습니다.
**********************************************************************************
 */
interface ReplyEditData{
  suggestid?: any;
  replyData?: any;
  state: any;
  dispatch: React.Dispatch<any>;
  handleHelpToggle: () => void;
  handleReplyReload: () => void;
}

/*
SuggestReplyEditor
**********************************************************************************
<개요>
기능제안 답변하기 글을 작성하는 편집기 컴포넌트 입니다.
<백엔드 요청목록>
url: '/feature-suggestion/reply', method: 'POST'
url: '/feature-suggestion/reply', method: 'PATCH'
**********************************************************************************
1.작성글에대한 수정, 작성 ui를 만듭니다.
2.백엔드로 작성글에대한 수정, 작성 요청을 보냅니다.
3. replyData 있으면 patch가, 없으면 post가 렌더링 됩니다.
4. post및 patch 요청시 suggestid를 포함하여 replyData 에대한 post/patch 요청을 보냅니다.
**********************************************************************************
 */
export default function SuggestReplyEditor(props: ReplyEditData): JSX.Element {
  const {
    state, dispatch, handleHelpToggle, handleReplyReload, replyData, suggestid,
  } = props;
  const [, executePost] = useAxios(
    { url: '/feature-suggestion/reply', method: 'POST' }, { manual: true },
  );
  const [, executePatch] = useAxios(
    { url: '/feature-suggestion/reply', method: 'PATCH' }, { manual: true },
  );
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
                        author: 'TruePoint',
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
                if (window.confirm('기능제안 답변을 정말로 남기시겠습니까?')) {
                  executePost({
                    data: {
                      suggestionId: suggestid,
                      content: state.content,
                      author: 'TruePoint',
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
