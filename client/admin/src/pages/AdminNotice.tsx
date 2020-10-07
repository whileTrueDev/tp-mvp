import React from 'react';
import useAxios from 'axios-hooks';
import { Grid, Typography } from '@material-ui/core';
// organisms
import NoticeTable from '../organisms/notice/NoticeTable';
import NoticePreview from '../organisms/notice/NoticePreView';
import NoticeWrite from './NoticeWrite';

export interface NoticeData {
  title?: string;
  author: string;
  category?: string;
  code?: number;
  createdAt: string;
  content: string;
  isImportant: number;
}

// :noticeData[] --> noticeData의 타입을 가지는 배열을 만든다.
export default function NoticeBoard() {
  // 공지사항 선택을 위한 State
  // useState<NoticeData> 제네릭타입 //
  const [selectedData, setSelectedData] = React.useState<NoticeData>();

  // 데이터 가져오기
  const [{ loading, error, data }] = useAxios(
    { url: 'http://localhost:3000/admin/notice', method: 'GET' }
  );

  function handleSelectedData(data: NoticeData) {
    setSelectedData(data);
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
      <div style={{ padding: 28 }}>
        {loading && (<h3>Loading...</h3>)}
        <Typography variant="h5">
          공지사항 목록
        </Typography>
      </div>
      {!loading && (
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <NoticeTable

            noticeData={data}
            handleData={handleSelectedData}
            handleEditModeOff={handleEditModeOff}
          />

        </Grid>
        <Grid item xs={12} lg={6}>
          {selectedData && (
          <NoticePreview
            selectedData={selectedData}
            handleEditModeOn={handleEditModeOn}
          />
          )}
        </Grid>
      </Grid>
      )}
      {editMode && (<NoticeWrite noticeData={selectedData} />)}
    </div>
  );
}
