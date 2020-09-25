import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import NoticeMarkdownHelper from '../markdown_helper/MarkdownHelper';
import SuggestReplyEditViewer from './SuggestEditViewer';
import SuggestReplyEditor from './SuggestEditor';
import { SuggestData } from '../../pages/AdminSuggest';
import '../../assets/font.css';
import suggestDataset from '../../pages/AdminSuggest';

const initialState = {
  title: '기능제안', topic: '기능제안 답글', contents: '기능제안 답변작성중',
};

function reducer(state: any, action: any) {
  const {
    type, title, topic, contents,
  } = action;
  switch (type) {
    case 'reset':
      return initialState;
    case 'handleTitle':
      return { ...state, title };
    case 'handleTopic':
      if (state.title.indexOf(']') > 0) {
        return { ...state, topic, title: `[${topic}]${state.title.split(']')[1]}` };
      }
      return { ...state, topic, title: `[${topic}] ${state.title}` };
    case 'handleContents':
      return { ...state, contents };
    default: throw Error(`unexpected action.type: ${action.type}`);
  }
}

interface SelectedData{
  suggestData?: SuggestData;
}
export default function SuggestWrite(props: SelectedData) {
  const { suggestData } = props;
  const [state, dispatch] = React.useReducer(reducer, suggestData || initialState);
  const [help, setHelp] = React.useState(false);
  
  function handleHelpToggle() {
    setHelp(!help);
  }


  return (
    <div>
      <div style={{ padding: 28 }}>
        <Typography variant="h5">
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
              suggestData={suggestData}
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