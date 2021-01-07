import React from 'react';
import { Grid, Typography } from '@material-ui/core';
// organisms
import useAxios from 'axios-hooks';
import ReplyWrite from './writer/ReplyWrite';
import ReplyTable from './table/ReplyTable';
import ReplyPreViewer from './viewer/ReplyPreViewer';

/*
dataprops
**********************************************************************************
<개요>
NoticeSet을 위한 props입니다.
**********************************************************************************
1. suggestionId : 기능제안글 id props입니다.
**********************************************************************************
 */
interface dataprops{
  suggestionId: any;
}
/*
ReplySet
**********************************************************************************
<개요>
기능제안 답변글의  Table 컴포넌트와 Writer 컴포넌트 및 DataPreView컴포넌트의 부모 컴포넌트 입니다.
이곳에서 @Material-ui/core의 Grid를 이용해 table과 DataPreView component, writer component의 
배치를 정합니다.
<백엔드 요청목록>
-url: '/feature-suggestion/reply', method: 'GET'
**********************************************************************************
1.ReplyTable : 글 목록을 보여주는 table입니다.
2.ReplyPreViewer : 개별글을 보여주는 preview입니다.
3. ReplyWrite : 글을작성하는 writer입니다.
**********************************************************************************
 */
export default function ReplySet(data: dataprops): JSX.Element {
  // 공지사항 선택을 위한 State
  // useState<NoticeData> 제네릭타입 //
  const { suggestionId } = data;
  const [{ loading: replyLoading, data: replyData }, reload] = useAxios(
    { url: '/feature-suggestion/reply', method: 'GET', params: { id: suggestionId } },
  );

  const [selectedData, setSelectedData] = React.useState<any>();
  const [replyeditMode, setEditMode] = React.useState(false);

  function handleReload() {
    reload({ params: { id: suggestionId } });
  }
  /* 
    기능제안 개별보기를 위한 핸들러  
  */
  function handleSelectedData(d: any) {
    setSelectedData(d);
  }

  function handleReplyEditModeOn() {
    setEditMode(true);
  }

  function handleReplyEditModeOff() {
    setEditMode(false);
  }

  return (
    <div>
      {replyLoading && (
        <div style={{ padding: 28 }}>
          <h3>Loading...</h3>
        </div>
      )}
      {!replyLoading && (
        <div>
          <div style={{ padding: 28 }}>
            <Typography variant="h5">
              기능제안 답변글
            </Typography>
          </div>

          <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
              <ReplyTable
                selectedSuggestionId={suggestionId}
                replyData={replyData}
                handleReplyData={handleSelectedData}
                handleReplyEditModeOff={handleReplyEditModeOff}
              />

            </Grid>
            <Grid item xs={12} lg={6}>
              {selectedData && (
              <ReplyPreViewer
                handleReload={handleReload}
                replyData={selectedData}
                handleReplyEditModeOn={handleReplyEditModeOn}
              />
              )}
            </Grid>
          </Grid>
          {replyeditMode && <ReplyWrite replyData={selectedData} handleReplyReload={handleReload} />}
        </div>
      )}
    </div>

  );
}
