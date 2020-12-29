import React from 'react';
import {
  Typography, Paper, Divider, Button, Grid, Table,
} from '@material-ui/core';
import Markdown from 'react-markdown';
import useAxios from 'axios-hooks';
import CostomTableRow from './CostomTableRow';

/* 
Props
****************************************************************************************
ReplyPreViewer를 위한 Props입니다.
****************************************************************************************
replyData: 동일한 suggestionId를 가진 답글목록중 선택된 1개의 객체타입의 데이터에대한 속성값을 전달받습니다.
handleEditModeON: 글 편집기 컴포넌트를 렌더링하기 위한 핸들러를 전달받습니다.
handleReload: 글 목록 게시글에 변경사항이 있을경우 리 렌더링하기위한 핸들러 함수를 전달 받습니다.
****************************************************************************************
*/
interface Props {
  replyData: any;
  handleReplyEditModeOn: () => void;
  handleReload: () => void;
}

/* 
ReplyPreViewer
************************************************************************
<개요>
답변목록 사용되는 데이터 개별보기를 위한 컴포넌트 입니다.
<백엔드요청목록>
url: '/feature-suggestion/reply', method: 'DELETE'
************************************************************************
1. 개별 데이터의 정보가 표시됩니다.
2. 수정하기 버튼 클릭시 handleEditModeON 핸들러를 이용해 글 편집 컴포넌트를 랜더링시킵니다.
3. 삭제하기 버튼 클릭시 백엔드로 delete 요청을 보낸다음 hadndleReload 핸들러를 통해 변경된
답변 목록 데이터를 리랜더링합니다.
4. Markdown 컴포넌트를 통해 데이터의 content를 표시합니다.
************************************************************************
*/

export default function ReplyPreViewer(props: Props): JSX.Element {
  const { replyData, handleReplyEditModeOn, handleReload } = props;
  // 데이터 삭제
  const [, executeDelete] = useAxios(
    { url: '/feature-suggestion/reply', method: 'DELETE' }, { manual: true },
  );

  return (
    <Paper>
      <div style={{ padding: 28 }}>
        <Typography variant="h4">
          {`${replyData.author.userId} ${replyData.author.nickName ? `(${replyData.author.nickName})` : ''}`}
        </Typography>
        <div style={{
          display: 'flex', marginTop: 5, marginBottom: 5, justifyContent: 'space-bwtween',
        }}
        >
          <Table size="small">
            <CostomTableRow title="작성자" data={`${replyData.author.userId} ${replyData.author.nickName ? `(${replyData.author.nickName})` : ''}`} />
            <CostomTableRow title="기능제안글 ID" data={String(replyData.suggestionId)} />
          </Table>
        </div>
        {replyData.content && (
        <div>
          <Grid container spacing={1}>
            <Grid item xs={12} lg={3}>
              <Button
                color="primary"
                variant="contained"
                onClick={handleReplyEditModeOn}
              >
                답변수정
              </Button>
            </Grid>

            <Grid item xs={12} lg={3}>
              <Button
                style={{ marginLeft: 5, marginRight: 5 }}
                color="secondary"
                variant="contained"
                onClick={() => {
                  if (window.confirm(`정말로\n${replyData.replyId}\n답변을 삭제하시겠습니까?`)) {
                    executeDelete({
                      data: {
                        id: replyData.replyId,
                      },
                    }).then((res) => {
                      handleReload();
                    }).catch((err) => {
                      console.error('err', err);
                    });
                  }
                }}
              >
                삭제하기
              </Button>
            </Grid>

          </Grid>

        </div>
        )}
      </div>
      <Divider />

      <div style={{ padding: 28, maxHeight: 750, overflow: 'scroll' }}>
        <Markdown
          source={replyData.content}
          escapeHtml={false}
          renderers={{ code: ({ value }: {value: any}) => <Markdown source={value} /> }}
        />
      </div>

    </Paper>
  );
}
