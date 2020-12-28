import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import NoticeMarkdownHelper from '../../markdown_helper/MarkdownHelper';
import SuggestReplyEditViewer from '../viewer/ReplyEditViewer';
import SuggestReplyEditor from './ReplyEditor';
import '../../../assets/font.css';

/*
ReplyDataProps
**********************************************************************************
ReplyWrite를 위한 props입니다.
**********************************************************************************
replyData (optional) : 답변글에대한 데이터를 전달받는 속성값입니다.
id(optional) : 답변글 데이터를 post하기위한 속성값입니다.
handleReplyReload : 답변글목록에 변경사항을 랜더링하기위한 핸들러함수를 전달받습니다.
**********************************************************************************
 */
interface ReplyDataProps{
  replyData?: any;
  id?: any;
  handleReplyReload: () => void;
}
/*
ReplyWrite
**********************************************************************************
기능제안 답변하기 글을 작성하는 편집기 컴포넌트 입니다.
**********************************************************************************
1. 기능제안 답변하기 편집을위한 SuggestReplyEditor,SuggestReplyEditViewer,
NoticeMarkdownHelper 가 위치합니다.
2. NoticeMarkdownHelper는 이름은 Notice가 붙지만 모든 글작성을위한 부모컴포넌트에서 동일하게
사용되고 있습니다.
**********************************************************************************
 */
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
