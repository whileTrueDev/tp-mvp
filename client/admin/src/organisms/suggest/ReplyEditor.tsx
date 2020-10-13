import React from 'react';
import {
  Typography, Paper, TextField, Button, Grid,
  Divider, makeStyles,
} from '@material-ui/core';
import { ReplyData } from '../../pages/AdminSuggest';

interface ReplyEditData{
  state: ReplyData;
  dispatch: React.Dispatch<any>;
  handleHelpToggle: () => void;

}

const useStyles = makeStyles((theme) => ({
  deleteButton: { marginBottom: 5, marginRight: -5 },
}));

export default function SuggestReplyEditor(props: ReplyEditData): JSX.Element {
  const {
    state, dispatch, handleHelpToggle,
  } = props;
  const classes = useStyles();
  return (
    <Paper>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 14 }}>
        <Typography variant="h6">
          기능제안 답변작성 칸
        </Typography>

        <Button
          style={{ backgroundColor: 'rgb(255, 140, 150, 0.8)', color: '#fff' }}
          onClick={() => {
            handleHelpToggle();
          }}
        >
          마크다운 작성 도움말 보기
        </Button>
      </div>
      <Divider />

      <div style={{ padding: 14 }}>
        <TextField
          id="author-textfield"
          label="작성자명을 작성하세요."
          variant="outlined"
          style={{ width: '65%', padding: 5 }}
          value={state.author}
          onChange={(e) => dispatch({ type: 'handleAuthor', title: e.target.value })}
          margin="normal"
        />

        <TextField
          multiline
          id="content-textfield"
          label="내용을 마크다운으로 작성하세요."
          variant="outlined"
          rows={24}
          style={{ width: '100%', padding: 5 }}
          onChange={(e) => dispatch({ type: 'handleContent', content: e.target.value })}
          margin="normal"
        />
      </div>

      <div style={{ padding: 14, display: 'flex', justifyContent: 'flex-end' }}>
        <Grid container spacing={1}>
          <Grid item xs={6} lg={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                if (window.confirm('기능제안 답변\n정말로 답변을 수정하시겠습니까?')) {
                  // 백앤드로 업로드
                  window.location.reload();
                }
              }}
            >
              해당 답변글 수정
            </Button>
          </Grid>
          <Grid item xs={6} lg={6}>
            <Button
              className={classes.deleteButton}
              color="secondary"
              variant="contained"
              onClick={() => {
                if (window.confirm('정말로 해당 답변을 삭제하시겠습니까?')) {
                // 백엔드로 업로드
                  window.location.reload();
                }
              }}
            >
              답변삭제
            </Button>
          </Grid>
        </Grid>
      </div>
    </Paper>
  );
}
