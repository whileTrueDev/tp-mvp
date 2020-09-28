import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import useFetch from './useFetch';

// organisms
import NoticeTable from '../organisms/notice/NoticeTable';
import NoticePreview from '../organisms/notice/NoticePreView';
import NoticeWrite from './NoticeWrite';

export interface NoticeData {
  title?: string;
  topic?: string;
  regiDate: string;
  contents?: string;
  isImportant?: boolean; // 필독사항 등의 문구를 추가할때, isImportant를 사용하여 구분할 수있다.
}

const useStyles = makeStyles(theme => ({
  root: {
    overflow: 'auto',
    position: 'relative',
    float: 'right',
    maxHeight: '100%',
    width: '100%',
    overflowScrolling: 'touch',
  },
  // toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    marginTop: '70px',
    minHeight: 'calc(100vh - 123px)',
    width: `calc(100% - ${240}px)`,
  },
  selectBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));


export const noticeDataset: NoticeData[] = [{
  title: "제목",
  topic: "1",
  contents: "공지사항",
  regiDate: "2020-09-22",
  isImportant: true,
},
{
  title: "제목2",
  topic: '2',
  contents: "공지사항2",
  regiDate: "2020-09-22",
  isImportant: false,
},
{title: "제목",
topic: "3",
contents: "공지사항",
regiDate: "2020-09-22",
isImportant: true,
},
{title: "제목",
topic: "4",
contents: "공지사항",
regiDate: "2020-09-22",
isImportant: true,
},
];

// :noticeData[] --> noticeData의 타입을 가지는 배열을 만든다.
export default function NoticeBoard() {
  const classes = useStyles();
  
  
  // 공지사항 선택을 위한 State
  // useState<NoticeData> 제네릭타입 //
  const [selectedData, setSelectedData] = React.useState<NoticeData>();

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
    <div style={{ marginTop: 48 }}>
  
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
