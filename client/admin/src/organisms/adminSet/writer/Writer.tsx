import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import NoticeMarkdownHelper from '../../markdown_helper/MarkdownHelper';
import NoticeEditViewer from '../viewer/NoticeEditViewer';
import NoticeEditor from './NoticeEditor';
import '../../../assets/font.css';

const initialState = {
  title: '', category: '', content: '', author: '', isImportant: false, id: 0,
};

function reducer(state: any, action: any) {
  const {
    type, title, category, content, isImportant, author,
  } = action;
  switch (type) {
    case 'reset':
      return initialState;
    case 'handleTitle':
      return { ...state, title };

    case 'handleCategory':
      return { ...state, category };

    case 'handleContent':
      return { ...state, content };
    case 'handleisImportant':
      return { ...state, isImportant };
    case 'handleAuthor':
      return { ...state, author };

    default: throw Error(`unexpected action.type: ${action.type}`);
  }
}

/*
SelectedData
**********************************************************************************
Writer 위한 props입니다.
**********************************************************************************
noticeData (optional) : 공지사항 데이터를 전달받는 속성값입니다.
handleReload : 공지사항 글목록 변경사항을 랜더링하기위한 핸들러함수를 전달받습니다.
**********************************************************************************
 */
interface SelectedData{
  noticeData?: any;
  handleReload: () => void;
}

/*
Writer
**********************************************************************************
공지사항 답변하기 글을 작성하는 편집기 컴포넌트 입니다.
**********************************************************************************
<개요>
1. 공지사항 편집을위한 NoticeEditViewer,NoticeEditor,
NoticeMarkdownHelper 가 위치합니다.
2. NoticeMarkdownHelper는 이름은 Notice가 붙지만 모든 글작성을위한 부모컴포넌트에서 동일하게
사용되고 있습니다. 도움말 보기 클릭시 NoticeMarkdownHelper 컴포넌트가 화면에 도움말을보여줍니다.
**********************************************************************************
 */
export default function Writer(props: SelectedData): JSX.Element {
  const { noticeData, handleReload } = props;
  const [state, dispatch] = React.useReducer(reducer, noticeData || initialState);

  const [help, setHelp] = React.useState(false);
  function handleHelpToggle() {
    setHelp(!help);
  }
  return (
    <div>
      <div style={{ padding: 28 }}>
        <Typography variant="h5">
          공지사항 글작성
        </Typography>
      </div>

      <div style={{ padding: 28 }}>
        <Grid container spacing={2}>

          {/* 미리보기 */}
          <Grid item xs={12} md={6} lg={4}>
            <NoticeEditViewer state={state} />
          </Grid>

          {/* 글작성 */}
          <Grid item xs={12} md={6} lg={4}>
            <NoticeEditor
              state={state}
              dispatch={dispatch}
              handleReload={handleReload}
              handleHelpToggle={handleHelpToggle}
              noticeData={noticeData}
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
