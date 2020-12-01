import React from 'react';
import {
  Typography, Paper, Divider, Button, Grid, Table,
} from '@material-ui/core';
import Markdown from 'react-markdown';
import StatusChangeButton from '../../suggest/StatusChangeButton';
import CostomTableRow from './CostomTableRow';

interface Props {
  selectedData: any;
  ReplyModeOn: () => void;
  ReplyModeOff: () => void;
  ReplyPostModeOff: () => void;
  ReplyPostModeOn: () => void;
  handleReload: () => void;
}

export default function SuggestPreview(props: Props): JSX.Element {
  const {
    selectedData, ReplyModeOn, ReplyModeOff, ReplyPostModeOff, handleReload, ReplyPostModeOn,
  } = props;
  function handleState(Case: number) {
    switch (Case) {
      case 1:
        return '검토중';
      case 2:
        return '기능구현중';
      case 3:
        return '구현완료';
      default:
        return '';
    }
  }

  return (

    <Paper>
      <div style={{ padding: 28 }}>
        <Typography variant="h4">
          {selectedData.title}
        </Typography>
        <div style={{
          display: 'flex', marginTop: 5, marginBottom: 5, justifyContent: 'space-bwtween',
        }}
        >
          <Table size="small">
            <CostomTableRow title="작성자" data={`${selectedData.author.userId} ${selectedData.author.nickName ? `(${selectedData.author.nickName})` : ''}`} />
            <CostomTableRow title="SuggestionId" data={selectedData.suggestionId} />
            <CostomTableRow title="날짜" data={new Date(selectedData.createdAt).toLocaleString()} />
            <CostomTableRow title="카테고리" data={selectedData.category} />
            <CostomTableRow title="진행상태" data={handleState(selectedData.state)} />
          </Table>
        </div>
        {selectedData.content && (
        <div>
          <Grid container spacing={1}>
            <Grid item xs={12} lg={3}>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  ReplyModeOn();
                  ReplyPostModeOff();
                }}
              >
                답변목록
              </Button>
            </Grid>

            <Grid item xs={12} lg={3}>
              <StatusChangeButton
                handleReload={handleReload}
                selectedData={selectedData}
              />
            </Grid>

            <Grid item xs={12} lg={3}>
              <Button
                color="secondary"
                variant="contained"
                onClick={() => {
                  ReplyPostModeOn();
                  ReplyModeOff();
                }}
              >
                답변생성
              </Button>
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
