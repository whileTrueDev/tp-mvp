import React from 'react';
import {
  Typography, Paper, Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Markdown from 'react-markdown/with-html';

const useStyles = makeStyles((theme) => ({
  markdown: { fontSize: theme.typography.body1.fontSize },
  deleteButton: { marginBottom: 5, marginRight: -5 },
}));

/* 
Props
*****************************************************************************
SuggestReplyEditViewer를 위한 Props입니다.
*****************************************************************************
state: 개별보기(ReplyPreview.tsx)에서 선택된 selectedData를 전달받습니다.
*****************************************************************************
*/
interface ReplyEditData{
  state: any;
}
/*
 SuggestReplyEditViewer
******************************************************************************
<개요>
기능제안 개별글에대한 답변글 개별보기에서 수정하기 버튼을 클릭시 나타나는 편집기 세트중에서 작성중인 글을
미리볼 수 있는 컴포넌트 입니다.
******************************************************************************
1. state 데이터를 전달 받습니다.
2. Markdown 컴포넌트를 이용해 작성글 미리보기 컴포넌트를 만들 수 있습니다.
******************************************************************************
 */
export default function SuggestReplyEditViewer(props: ReplyEditData): JSX.Element {
  const { state } = props;
  const classes = useStyles();
  return (
    <div>
      <Paper>
        <div style={{ padding: 14 }}>

          <Typography variant="h6">
            답변 미리보기
          </Typography>
          <Divider />
        </div>

        <div style={{ padding: 14 }}>
          <Typography variant="h4">{state.author}</Typography>
        </div>
        {state.suggestionId && (<Divider />)}
        <div style={{ padding: 14 }}>
          <Markdown
            className={classes.markdown}
            source={state.content}
            escapeHtml={false}
          />
        </div>
      </Paper>

    </div>
  );
}
