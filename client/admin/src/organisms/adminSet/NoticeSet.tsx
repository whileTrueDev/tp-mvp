import React from 'react';
import { Grid, Typography } from '@material-ui/core';
// organisms
import Table from './table/Table';
import DataPreView from './viewer/DataPreView';
import Writer from './writer/Writer';

/*
  NoticeSet : 테이블과 미리보기, 작성하기 컴포넌트가 모여있는 부모 컴포넌트입니다.
  게재할 목록 Table에대한 data를 GET하는 요청을 이 컴포넌트가 위치할 페이지에서 하여서, table데이터를 전달하면 됩니다.
 */

/*
  각 페이지에서 NoticeData와 같은 Data에대한 props는 수정되어져야한다.
  앞으로 이 컴포넌트를 다른 페이지에서도 사용할 것이므로 NoticeData 프롭스로 
  고정해두면 안됩니다!
 */
interface dataprops {
  tabledata?: any;
  noticeLoading?: any;
  reload: () => void;
}
/* 
  관리자 페이지에서 기능제안, 공지사항에서 같이사용되므로 AdminSet이라는 하나의 컴포넌트로 합쳤습니다.
*/
export default function NoticeSet(data: dataprops): JSX.Element {
  // 공지사항 선택을 위한 State
  // useState<NoticeData> 제네릭타입 //
  const {
    tabledata, noticeLoading, reload,
  } = data;
  const [selectedData, setSelectedData] = React.useState<any>();

  function handleReload() {
    reload();
  }

  function handleSelectedData(d: any) {
    setSelectedData(d);
  }

  // 수정 모드를 위한 State
  const [editMode, setEditMode] = React.useState(false);

  function handleEditModeOn() {
    setEditMode(true);
  }

  function handleEditModeOff() {
    setEditMode(false);
  }

  return (
    <div>
      {noticeLoading && (
        <div style={{ padding: 28 }}>
          <h3>Loading...</h3>
        </div>
      )}
      {!noticeLoading && (
        <div>
          <div style={{ padding: 28 }}>
            <Typography variant="h5">
              공지사항
            </Typography>
          </div>

          <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
              <Table
                tableData={tabledata}
                handleData={handleSelectedData}
                handleEditModeOff={handleEditModeOff}
              />

            </Grid>
            <Grid item xs={12} lg={6}>
              {selectedData && (
              <DataPreView
                handleReload={handleReload}
                selectedData={selectedData}
                handleEditModeOn={handleEditModeOn}
              />
              )}
            </Grid>
          </Grid>
          {editMode && <Writer noticeData={selectedData} handleReload={handleReload} />}
        </div>
      )}
    </div>

  );
}
