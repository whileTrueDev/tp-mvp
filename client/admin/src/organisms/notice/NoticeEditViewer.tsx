import React from 'react';
import {
  Typography, Paper, Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Markdown from 'react-markdown/with-html';
import { NoticeData } from '../../pages/AdminNotice';

const useStyles = makeStyles((theme) => ({
  markdown: { fontSize: theme.typography.body1.fontSize }
}))

interface NoticeEditData{
  state: NoticeData;
}
export default function NoticeEditViewer(props: NoticeEditData) {
  const { state } = props;
  const classes = useStyles();
  return (
    <div>
      <Paper>
        <div style={{ padding: 14 }}>

          <Typography variant="h6">
              공지사항 글작성 미리보기
          </Typography>
          <Divider />
        </div>

        <div style={{ padding: 14 }}>
          <Typography variant="h4">{state.title}</Typography>
        </div>
        {state.title && (<Divider />)}
        <div style={{ padding: 14 }}>
        <Markdown
          className={classes.markdown}
          source={state.contents}
          escapeHtml={false}
          />
        </div>
      </Paper>

    </div>
  );
}