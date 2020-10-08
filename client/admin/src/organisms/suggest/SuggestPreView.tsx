import React from 'react';
import {
  Typography, Paper, Divider, Button, Grid, Table
} from '@material-ui/core';
import { SuggestData } from '../../pages/AdminSuggest';
import StatusChangeButton from './StatusChangeButton';
import CostomTableRow from './CostomTableRow';

const Markdown = require('react-markdown');

interface Props {
  selectedData: SuggestData;
  handleEditModeOn: () => void;
}

export default function SuggestPreview(props: Props) {
  const { selectedData, handleEditModeOn } = props;
  const [state, setState] = React.useState("");

  function handleClick(data: string) {
    setState(data);
  }
  
  return (
    <Paper>
       <div style={{ padding: 28 }}>
        <Typography variant="h4">
        {selectedData.title}
        </Typography>
        <div style={{ display: 'flex', marginTop: 5,marginBottom: 5,justifyContent: 'space-bwtween' }}>
          <Table size='small'>
            <CostomTableRow title={'작성자'} data={selectedData.author}/>
            <CostomTableRow title={'날짜'} data={new Date(selectedData.createdAt).toLocaleString()}/>
            <CostomTableRow title={'카테고리'} data={selectedData.category}/>
            <CostomTableRow title={'진행상황'} data={selectedData.state}/>
          </Table>
        </div>
        {selectedData.content && (
          <div>
            <Grid container spacing={1}>
              <Grid item xs={12} lg={3}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick= {handleEditModeOn}
                >
                  답변목록보기
                </Button>
              </Grid>

              <Grid item xs={12} lg={3}>
                <StatusChangeButton 
                selectedData={selectedData}
                />
              </Grid>

            </Grid>
          </div>
        )}
      </div>
      <Divider />

      <div style={{ padding: 28, maxHeight: 750, overflow: 'scroll' }}>
        <Markdown
          source={selectedData.content}
          escapeHtml={false}
          renderers={{ code: ({ value }: {value: any}) => <Markdown source={value} /> }}
        />
      </div>

    </Paper>
  );
}
