import React, { useEffect } from 'react';
import useAxios from 'axios-hooks';
import { Grid, Typography } from '@material-ui/core';
// organisms
import NoticeTable from '../organisms/notice/NoticeTable';
import NoticePreview from '../organisms/notice/NoticePreView';
import NoticeWrite from './NoticeWrite';

export interface NoticeData {
  title?: string;
  category?: string;
  code?: number;
  regiDate: string;
  contents?: string;
  isImportant?: boolean; // 필독사항 등의 문구를 추가할때, isImportant를 사용하여 구분할 수있다.
}


export const noticeDataset: NoticeData[] = [{
  title: "제목",
  category: "업데이트",
  code: 1,
  contents: "공지사항",
  regiDate: "2020-09-22",
  isImportant: true,
},
{
  title: "제목2",
  category: '업데이트',
  code: 2,
  contents: "공지사항2",
  regiDate: "2020-09-22",
  isImportant: false,
},
{title: "제목",
category: "필독",
code: 3,
contents: "공지사항",
regiDate: "2020-09-22",
isImportant: true,
},
{title: "제목",
category: "필독",
code: 4,
contents: "공지사항",
regiDate: "2020-09-22",
isImportant: true,
},
];

// :noticeData[] --> noticeData의 타입을 가지는 배열을 만든다.
export default function NoticeBoard() {
  
  // 공지사항 선택을 위한 State
  // useState<NoticeData> 제네릭타입 //
  const [selectedData, setSelectedData] = React.useState<NoticeData>();
  const [{ error, loading }, getRequest] = useAxios(
    '/admin/notice', { manual: true }
  );

  useEffect(()=>{
    getRequest()
    .then((row)=>{
      console.log(row.data);
    })
  }, [])

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
    <div >

      <div style={{ padding: 28 }}>
        <Typography variant="h5">
          공지사항 목록
        </Typography>
      </div>
  
     <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <NoticeTable
              noticeData={noticeDataset}
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

       {editMode && (<NoticeWrite noticeData={selectedData} />)}

    </div>
  );
}
