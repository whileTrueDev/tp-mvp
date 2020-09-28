import React from 'react';
import {
  Typography, Paper, Divider,Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Markdown from 'react-markdown/with-html';
import { SuggestData } from '../../pages/AdminSuggest';

const useStyles = makeStyles((theme) => ({
  markdown: { fontSize: theme.typography.body1.fontSize },
  deleteButton: { marginBottom: 5, marginRight: -5}
}))

interface SuggesEdittData{
  state: SuggestData;
}
export default function SuggestReplyEditViewer(props: SuggesEdittData) {
  const { state } = props;
  const classes = useStyles();
  return (
    <div>
      <Paper style={{alignItems: 'center',justifyContent: 'center'}}>
        <div style={{ padding: 14 }}>

          <Typography variant="h5">
              기능제안 답변 글작성 미리보기
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