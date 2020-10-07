import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import NoticeMarkdownHelper from '../organisms/markdown_helper/MarkdownHelper';
import NoticeEditViewer from '../organisms/notice/NoticeEditViewer';
import NoticeEditer from '../organisms/notice/NoticeEditer';
import { NoticeData } from './AdminNotice';
import '../assets/font.css';
import noticeDataset from './AdminNotice';

const initialState = {
  title: '공지사항', topic: '공지사항', content: '공지사항작성중',
};

function reducer(state: any, action: any) {
  const {
    type, title, category, content, isImportant, author
  } = action;
  switch (type) {
    case 'reset':
      return initialState;
    case 'handleTitle':
      return { ...state, title };
    
    case 'handleCategory':
      if (state.title.indexOf(']') > 0) {
        return { ...state, category, title: `[${category}]${state.title.split(']')[1]}` };
      }
      return { ...state, category, title: `[${category}] ${state.title}` };

    case 'handleContent':
      return { ...state, content };
    case 'handleisImportant':
      return {...state, isImportant};
    case 'handleAuthor':
        return {...state, author};

    default: throw Error(`unexpected action.type: ${action.type}`);
  }
}

interface SelectedData{
  noticeData?: NoticeData;
}
export default function NoticeWrite(props: SelectedData) {
  const { noticeData } = props;
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
            <NoticeEditer
              state={state}
              dispatch={dispatch}
              helpToggle={help}
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