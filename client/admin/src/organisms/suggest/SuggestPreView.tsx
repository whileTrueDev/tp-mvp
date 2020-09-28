import React from 'react';
import {
  Typography, Paper, Divider, Button, Grid, Table
} from '@material-ui/core';
import { SuggestData } from '../../pages/AdminSuggest';
import StatusChangeButton from './StatusChangeButton';
import CostomTableRow from './CostomTableRow';

const Markdown = require('react-markdown');

// interface SuggestData {
//   title: string;
//   topic: string;
//   regiDate: string;
//   writer: string;
//   contents: string;
//   status: string;
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
       <div style={{ padding: 28 }}>
        <Typography variant="h4">
        {selectedData.title}
        </Typography>
        <div style={{ display: 'flex', marginTop: 5,marginBottom: 5,justifyContent: 'space-bwtween' }}>
          <Table size='small'>
            <CostomTableRow title={'작성자'} data={selectedData.writer}/>
            <CostomTableRow title={'날짜'} data={new Date(selectedData.regiDate).toLocaleString()}/>
            <CostomTableRow title={'카테고리'} data={selectedData.categori}/>
            <CostomTableRow title={'진행상황'} data={selectedData.status}/>
          </Table>
        </div>
        {selectedData.contents && (
          <div>
            <Grid container spacing={0}>
              <Grid item xs={6} lg={2}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick= {handleEditModeOn}
                >
                  답변하기
                </Button>
              </Grid>

              <Grid item xs={6} lg={3}>
                <StatusChangeButton selectedData={selectedData}/>
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
