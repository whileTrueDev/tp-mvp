import React from 'react';
import {
  Typography, Paper, Divider, Button, Grid
} from '@material-ui/core';
import { SuggestData } from '../../pages/AdminSuggest';
import SelectStatusButton from './SelectStatusButton';
// import { NoticeData } from '../pages/AdminNotice';

const Markdown = require('react-markdown');

// interface SuggestData {
//   title?: string;
//   topic?: string;
//   regiDate: string;
//   writer: string;
//   contents?: string;
//   status?: boolean;
// }

interface SuggestReplyEditData {
  state: SuggestData;
}

interface Props {
  selectedData: SuggestData;
  handleEditModeOn: () => void;
}

export default function SuggestPreview(props: Props) {
  const { selectedData, handleEditModeOn } = props;
  return (
    <Paper>
      <div style={{ padding: 50 }}>
        <Typography variant="h4">
          {selectedData.title}
        </Typography>

        <div style={{ display: 'flex', marginTop: 10, justifyContent: 'space-bwtween' }}>

          <Typography variant="subtitle1">
            {`${selectedData.topic},`}
                    &emsp;
          </Typography>
          <Typography variant="subtitle1">
            {new Date(selectedData.regiDate).toLocaleString()}
          </Typography>
          <Typography variant="subtitle1">
            {`,${selectedData.writer} ,`}
        </Typography>
        <Typography variant="subtitle1">
        {`${selectedData.status}`}
        </Typography>
        </div>

        {selectedData.contents && (
          <div>
            <Grid container spacing={0}>
              <Grid item xs={6} lg={2}>
                <Button
                 // style={{ marginLeft: 5, marginRight: 5 }}
                  color="primary"
                  variant="contained"
                  onClick= {event => {
                    handleEditModeOn();}}
                >
                  답변하기
                </Button>
              </Grid>

              <Grid item xs={6} lg={2}>
                <Button
                  //style={{ marginLeft: 5, marginRight: 5 }}
                  color="secondary"
                  variant="contained"
                  onClick={() => {
                    if (window.confirm(`정말로\n${selectedData.title}\n답변을 삭제하시겠습니까?`)) {
                      window.location.reload();
                    }
                  }}
                >
                삭제하기
                </Button>
              </Grid>
              
              <Grid item xs={6} lg={3}>
                <SelectStatusButton/>
              </Grid>
            </Grid>
          </div>
        )}

      </div>

      <Divider />

      <div style={{ padding: 28, maxHeight: 750, overflow: 'scroll' }}>
        <Markdown
          source={selectedData.contents}
          escapeHtml={false}
          renderers={{ code: ({ value }: {value: any}) => <Markdown source={value} /> }}
        />
      </div>

    </Paper>
  );
}
