import React from 'react';
import {
  Typography, Paper, Divider, Button, Grid, Table,
} from '@material-ui/core';
import Markdown from 'react-markdown';
import StatusChangeButton from '../../suggest/StatusChangeButton';
import CostomTableRow from './CostomTableRow';

/* 
Props
****************************************************************************************
SuggestPreview 위한 Props입니다.
****************************************************************************************
selectedData: 기능제안 목록중 선택된 1개의 객체타입의 데이터에대한 속성값을 전달받습니다.
ReplyModeOn : 답변을 하기위해 답글목록과 답변글을 편집하기위한 전체 컴포넌트를 가져오는 핸들러를 전달받습니다.
ReplyPostModeOff : 답변을 편집하는 편집기 컴포넌트를 렌더링하지 않도록하는 핸들러를 전달받습니다.
handleEditModeON: 답변을 편집하는 편집기 컴포넌트를 랜더링하도록 하는 핸들러를 전달받습니다.
handleReload: 글 목록 게시글에 변경사항이 있을경우 리 렌더링하기위한 핸들러 함수를 전달 받습니다.
****************************************************************************************
*/
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
