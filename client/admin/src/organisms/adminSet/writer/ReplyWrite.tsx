import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import NoticeMarkdownHelper from '../../markdown_helper/MarkdownHelper';
import SuggestReplyEditViewer from '../viewer/ReplyEditViewer';
import SuggestReplyEditor from './ReplyEditor';
import '../../../assets/font.css';

interface ReplyDataProps{
  replyData?: any;
  id?: any;
  handleReplyReload: () => void;
}

export default function ReplyWrite(props: ReplyDataProps): JSX.Element {
  const { replyData, id, handleReplyReload } = props;
  const initialState = {
    content: '', author: '', suggestionId: id,
  };
  function reducer(state: any, action: any) {
  // action은 type을 정의.
    const {
      type, author, content, suggestionId,
    } = action;

    switch (type) {
      case 'reset':
        return initialState;
      case 'handleTitle':
        return { ...state, author };
      case 'handleSuggestionId':
        return { ...state, suggestionId };
      case 'handleContent':
        return { ...state, content };
      default: throw Error(`unexpected action.type: ${action.type}`);
    }
  }
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
              suggestid={id}
              replyData={replyData}
              state={state}
              dispatch={dispatch}
              handleHelpToggle={handleHelpToggle}
              handleReplyReload={handleReplyReload}
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
