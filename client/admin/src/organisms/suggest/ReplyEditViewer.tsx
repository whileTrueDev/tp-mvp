import React from 'react';
import {
  Typography, Paper, Divider,Button, Chip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Markdown from 'react-markdown/with-html';
import { replyData } from '../../pages/AdminSuggest';

const useStyles = makeStyles((theme) => ({
  markdown: { fontSize: theme.typography.body1.fontSize },
  deleteButton: { marginBottom: 5, marginRight: -5}
}))

interface ReplyEditData{
  state: replyData[];
}
export default function SuggestReplyEditViewer(props: ReplyEditData) {
  const { state } = props;
  const classes = useStyles();
  console.log(state);
  return (
    
    <div>
      <Paper style={{alignItems: 'center',justifyContent: 'center'}}>
        <div style={{ padding: 12 }}>

          <Typography variant="h6">
              기능제안 답변 내역
          </Typography>
        <Divider />
        </div>
        <div>
          {state.map((v: any) => (
            <div style={{ padding: 6 }}>
              <div>
                <Typography >{"기능제안자 아이디 : "+v.suggestionId}</Typography>
              </div>
              <div style={{padding: 6}}>
                <Typography >{"게시일자 : "+ new Date(v.createdAt).toLocaleString()}</Typography>
              </div>
                <div style={{ padding: 6 }}>
                 <Typography>{"작성자 아이디 : "+`${v.userId}`}</Typography>
               </div>
               <div style={{padding: 6}}>
                 <Typography>{"작성자명 : " + `${v.author}`}</Typography>
               </div>
               <div style={{padding: 6}}>
                 <Typography>{"답변내용 : " }</Typography>
               </div>
              <div style={{ padding: 6 }}>
                  <Markdown
                    className={classes.markdown}
                    source={v.content}
                    escapeHtml={false}
                    />
                </div>
                <Divider />
              </div>
          ))}
        </div>
      </Paper>

    </div>
  );
}