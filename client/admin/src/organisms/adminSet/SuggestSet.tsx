import React from 'react';
import { Grid, Typography } from '@material-ui/core';
// organisms
import SuggestPreview from './viewer/SuggestPreView';
import SuggestTable from './table/SuggestTable';
import ReplyWrite from './writer/ReplyWrite';

/*
dataprops
**********************************************************************************
SuggestSet을 위한 props입니다.
**********************************************************************************
1. tabledata : tabledata props입니다.
2. suggestLoading : loading을위한 props입니다.
3. reload : reloading을위한 props입니다.
4. ReplyModeON : replyMode on을 위한 Props입니다.
5. setSuggestionId : suggestionId를 설정하기위한 props 입니다.
**********************************************************************************
 */
interface dataprops {
  tabledata?: any;
  suggestLoading?: any;
  reload: () => void;
  ReplyModeOn: () => void;
  ReplyModeOff: () => void;
  setSuggestionId: (id: any) => void;
}
/*
SuggestSet
**********************************************************************************
기능제안 글을 위한 Table 컴포넌트와 Writer 컴포넌트를 위치시키는 부모 컴포넌트 입니다.
**********************************************************************************
1.SuggestTable : 글 목록을 보여주는 table입니다.
2.SuggestPreview : 개별글을 보여주는 preview입니다.
3.ReplyWrite : 글을작성하는 writer입니다.
**********************************************************************************
 */
export default function SuggestSet(data: dataprops): JSX.Element {
  // 공지사항 선택을 위한 State
  const {
    tabledata, suggestLoading, reload, ReplyModeOn, ReplyModeOff, setSuggestionId,
  } = data;
  const [selectedData, setSelectedData] = React.useState<any>();

  const [sid, setSuggestionID] = React.useState<any>();
  function handleSuggestionId(v: any) {
    setSuggestionID(v);
  }
  function handleReload() {
    reload();
  }
  function handleSelectedData(d: any) {
    setSelectedData(d);
  }

  // 새로운 답변달기 모드를 위한 State
  const [replyPostMode, setPostMode] = React.useState(false);

  /*
    기능제안 Post컴포넌트를 위한 핸들러 - suggest preview
   */
  function ReplyPostModeOn() {
    setPostMode(true);
  }
  function ReplyPostModeOff() {
    setPostMode(false);
  }

  return (
    <div>
      {suggestLoading && (
        <div style={{ padding: 28 }}>
          <h3>Loading...</h3>
        </div>
      )}
      {!suggestLoading && (
        <div>
          <div style={{ padding: 28 }}>
            <Typography variant="h5">
              기능제안 글
            </Typography>
          </div>

          <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
              <SuggestTable
                setSuggestionId={setSuggestionId}
                tableData={tabledata}
                handleData={handleSelectedData}
                ReplyPostModeOff={ReplyPostModeOff}
                handleReplyModeOff={ReplyModeOff}
                handleSuggestionId={handleSuggestionId}
              />

            </Grid>
            <Grid item xs={12} lg={6}>
              {selectedData && (
              <SuggestPreview
                handleReload={handleReload}
                selectedData={selectedData}
                ReplyPostModeOn={ReplyPostModeOn}
                ReplyPostModeOff={ReplyPostModeOff}
                ReplyModeOn={ReplyModeOn}
                ReplyModeOff={ReplyModeOff}
              />
              )}
            </Grid>
          </Grid>
          {replyPostMode && <ReplyWrite id={sid} handleReplyReload={handleReload} />}
        </div>
      )}
    </div>

  );
}
