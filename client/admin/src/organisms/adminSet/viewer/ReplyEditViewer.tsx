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

interface ReplyEditData{
  state: any;
}
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
