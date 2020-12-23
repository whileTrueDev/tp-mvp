import React from 'react';
import {
  Typography, Paper, Divider, Button, Grid, Table,
} from '@material-ui/core';
import Markdown from 'react-markdown';
import useAxios from 'axios-hooks';
import CostomTableRow from './CostomTableRow';

interface Props {
  replyData: any;
  handleReplyEditModeOn: () => void;
  handleReload: () => void;
}

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
