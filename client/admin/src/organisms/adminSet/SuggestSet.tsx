import React from 'react';
import { Grid, Typography } from '@material-ui/core';
// organisms
import SuggestPreview from './viewer/SuggestPreView';
import SuggestTable from './table/SuggestTable';
import ReplyWrite from './writer/ReplyWrite';

/*
  SuggestSet : 테이블과 미리보기, 작성하기 컴포넌트가 모여있는 부모 컴포넌트입니다.
  게재할 목록 Table에대한 data를 GET하는 요청을 이 컴포넌트가 위치할 페이지에서 하여서, table데이터를 전달하면 됩니다.
 */

/*
  각 페이지에서 NoticeData와 같은 Data에대한 props는 수정되어져야한다.
  앞으로 이 컴포넌트를 다른 페이지에서도 사용할 것이므로 NoticeData 프롭스로 
  고정해두면 안됩니다!
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
  관리자 페이지에서 기능제안, 공å지사항에서 같이사용되므로 AdminSet이라는 하나의 컴포넌트로 합쳤습니다.
*/
export default function SuggestSet(data: dataprops): JSX.Element {
  // 공지사항 선택을 위한 State
  // useState<NoticeData> 제네릭타입 //
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
