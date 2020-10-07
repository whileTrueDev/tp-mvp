import React from 'react';
import { Grid, makeStyles, Typography } from '@material-ui/core';

// organisms
import SuggestTable from '../organisms/suggest/SuggestTable';
import SuggestPreview from '../organisms/suggest/SuggestPreView';
import ReplyWrite from '../organisms/suggest/ReplyWrite';

//기능제안 데이터를 관리하는 props
export interface SuggestData {
  title?: string;
  category?: string;
  regiDate: string;
  writer?: string;
  contents?: string;
  status?: string;  // 검토중, 진행중 상태
  isReplied?: boolean;  // 답변여부
}

//답변 데이터를 관리하는 props
export interface replyData {
  title?: string;
  category: string;
  replyDate: string;
  writer?: string;
  contents?: string;
  status?: string;  // 검토중, 진행중 상태
  isReplied?: boolean;  // 답변여부 
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

 
//Suggest 더미데이터
export const suggestDataset: SuggestData[] = [
  {
    title: "제목",
    category: "기타",
    contents: "기능제안1",
    regiDate: "2020-09-22",
    writer: "박상은",
    status: "검토중",
    isReplied: false,

  },
  {
    title: "제목2",
    category: '기타',
    contents: "기능제안2",
    writer: "박상은",
    regiDate: "2020-09-22",
    status: "검토중",
    isReplied: false,

  },
  {
    title: "제목3",
    category: "구독관련",
    contents: "이런기능좀 추가해주세용ㅇㄹㅇㄹㅇ",
    regiDate: "2020-09-22",
    writer: "박상은",
    status: "검토중",
    isReplied: false,
  },
  {
    title: "제목4",
    category: "비교분석",
    contents: "기능제안4",
    regiDate: "2020-09-22",
    writer: "박상은",
    status: "검토중",
    isReplied: false,
  },
];

// :noticeData[] --> noticeData의 타입을 가지는 배열을 만든다.
export default function SuggestBoard() {
  const classes = useStyles();
 
  // 기능제안 선택을 위한 State
  var [selectedData, setSelectedData] = React.useState<SuggestData>({title: "",
  category: "",
  contents: "",
  regiDate: "",
  writer: "",
  status: "",
  });
  
  var[replyData, setReplyData] = React.useState<replyData>({title: "",
  category: "",
  contents: "",
  replyDate: "",
  writer: "관리자",
  status: ""});

  function handleSelectedData(data: SuggestData) {
    setSelectedData(data);
  }
  
  function handleReplyData(data: replyData) {
    setReplyData(data);
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
        <Typography variant="h5">
        기능제안
        </Typography>
      </div>
  
     <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <SuggestTable
              suggestData={suggestDataset}
              handleData={handleSelectedData}
              handleEditModeOff={handleEditModeOff}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            {selectedData && (
              <SuggestPreview
                selectedData={selectedData}
                handleEditModeOn={handleEditModeOn}
              />
            )}
          </Grid>

        </Grid>

       {editMode && (<ReplyWrite replyData={replyData} />)}

    </div>
  );
}
