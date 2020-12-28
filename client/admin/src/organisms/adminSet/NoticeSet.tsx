import React from 'react';
import { Grid, Typography } from '@material-ui/core';
// organisms
import Table from './table/Table';
import DataPreView from './viewer/DataPreView';
import Writer from './writer/Writer';

/*
dataprops
**********************************************************************************
NoticeSet을 위한 props입니다.
**********************************************************************************
1. tabledata (optional) : tabledata를위한 props입니다.
2. noticeLoading (optional) : loading을위한 props입니다.
3. reload : 화면 reload를위한 props입니다.
**********************************************************************************
 */
interface dataprops {
  tabledata?: any;
  noticeLoading?: any;
  reload: () => void;
}
/*
NoticeSet
**********************************************************************************
공지사항 글을 위한 Table 컴포넌트와 Writer 컴포넌트를 위치시키는 부모 컴포넌트 입니다.
**********************************************************************************
1.Table : 공지사항 목록을 보여주는 table입니다.
2.DataPreView : 개별글을 보여주는 preview입니다.
3. Writer : 글을작성하는 writer입니다.
**********************************************************************************
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
