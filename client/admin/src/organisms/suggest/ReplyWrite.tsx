import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import NoticeMarkdownHelper from '../markdown_helper/MarkdownHelper';
import SuggestReplyEditViewer from './ReplyEditViewer';
import SuggestReplyEditor from './ReplyEditor';
import { SuggestData, replyData } from '../../pages/AdminSuggest';
import '../../assets/font.css';
// import suggestDataset from '../../pages/AdminSuggest';

const initialState = {
  title: '기능제안', category: '기능제안 답글', contents: '기능제안 답변작성중',
};

interface ActionProps {
  type: string;
  title: string;
  category: string;
  contents: string;
}

function reducer(state: any, action: ActionProps) {
  //action은 type을 정의.
  const {
    type, title, category, contents,
  } = action;

  switch (type) {
    case 'reset':
      return initialState;
    case 'handleTitle':
      return { ...state, title };
    case 'handleTopic':
      if (state.title.indexOf(']') > 0) {
        return { ...state, category, title: `[${category}]${state.title.split(']')[1]}` };
      }
      return { ...state, category, title: `[${category}] ${state.title}` };
    case 'handleContents':
      return { ...state, contents };
    default: throw Error(`unexpected action.type: ${action.type}`);
  }
}

interface replyDataProps{
  replyData?: replyData;
}

export default function ReplyWrite(props: replyDataProps) {
  const { replyData } = props;
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
              helpToggle={help}
              handleHelpToggle={handleHelpToggle}
              replyData={replyData}
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