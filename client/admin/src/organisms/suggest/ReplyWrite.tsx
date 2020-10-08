import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import NoticeMarkdownHelper from '../markdown_helper/MarkdownHelper';
import SuggestReplyEditViewer from './ReplyEditViewer';
import SuggestReplyEditor from './ReplyEditor';
import { replyData } from '../../pages/AdminSuggest';
import '../../assets/font.css';

const initialState = {
  userId: '', content: '',createdAt: '', author: '', replyId: '',suggestionId: ''
};

interface ActionProps {
  type: string;
  author: string;
  content: string;
  userId: string;
  suggestionId : string;
  createdAt: string;
  replyId: string;
}

function reducer(state: any, action: ActionProps) {
  //action은 type을 정의.
  const {
    type, author, userId, content, suggestionId, createdAt,
  } = action;

  switch (type) {
    case 'reset':
      return initialState;
    case 'handleAuthor':
      return { ...state, author };
    case 'handleuserId':
      return { ...state, userId };
    case 'handleSuggestionId':
        return { ...state, suggestionId };
    case 'handleContent':
      return { ...state, content };
    case 'handlecreatedAt':
        return { ...state, createdAt };
    default: throw Error(`unexpected action.type: ${action.type}`);
  }
}

interface replyDataProps{
  replyData: replyData;
}

export default function ReplyWrite(props: replyDataProps) {
  const{ replyData } = props;

  const [state, dispatch] = React.useReducer(reducer, replyData || initialState);
  const [help, setHelp] = React.useState(false);

  function handleHelpToggle() {
    setHelp(!help);
  }

  return (
    <div>
      <div style={{ padding: 28 }}>
        <Typography variant="h6">
        기능제안 답변글 작성
        </Typography>
      </div>

      <div style={{ padding: 28 }}>
        <Grid container spacing={2}>

          {/* 미리보기 */}
          <Grid item xs={12} md={6} lg={4}>
            <SuggestReplyEditViewer state={state} />
          </Grid>

          {/* 글작성 */}
          <Grid item xs={12} md={6} lg={4}>
            <SuggestReplyEditor
              state={state}
              dispatch={dispatch}
              handleHelpToggle={handleHelpToggle}
            />

          </Grid>

          {/* 도움말 */}
          <Grid item xs={12} md={12} lg={4}>
            {help ? (
              <NoticeMarkdownHelper />
            ) : (null)}

          </Grid>

        </Grid>
      </div>

    </div>
  );
}