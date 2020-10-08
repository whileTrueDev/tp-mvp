import React from 'react';
import { Grid, makeStyles, Typography } from '@material-ui/core';
// organisms
import SuggestTable from '../organisms/suggest/SuggestTable';
import SuggestPreview from '../organisms/suggest/SuggestPreView';
import ReplyWrite from '../organisms/suggest/ReplyWrite';
import useAxios from 'axios-hooks';

//기능제안 데이터를 관리하는 props
export interface SuggestData {
  suggestionId?: string;
  title?: string;
  category?: string;
  createdAt: string;
  content?: string;
  author?: string;  // 검토중, 진행중 상태
  state?: string;
  like?: Number;  // 답변여부
}

//답변 데이터를 관리하는 props
export interface replyData {
  suggestionId?: string;
  replyId?: string;
  userId?: string;
  createdAt: string;
  content?: string;
  author?: string;  // 검토중, 진행중 상태
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


// :noticeData[] --> noticeData의 타입을 가지는 배열을 만든다.
export default function SuggestBoard() {
  const classes = useStyles();
 
  // 기능제안 선택을 위한 State
  var [selectedData, setSelectedData] = React.useState<SuggestData>({title: "",
  category: "",
  content: "",
  createdAt: "",
  author: "",
  state: "",
  });
  

  const [{data: suggestData, loading: getLoading}] = useAxios({
    url: "http://localhost:3000/admin/feature-suggestion", method: "GET"
  });

  const [{data: replyData, loading: replyLoading}, executeGet] = useAxios({
    url: "http://localhost:3000/admin/suggestion-reply", method: "GET",
  }, {manual: true});

  React.useEffect(() => {
    executeGet({
      params: {
        id : 1
      }
    }).then((res)=>{
      console.log(res.data);
    })
  },[]);
  function handleSelectedData(data: SuggestData) {
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
        <Typography variant="h5">
        기능제안
        </Typography>
      </div>
  
     <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <SuggestTable
              suggestData={suggestData}
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

       {editMode && (<ReplyWrite replyData={replyData}/>)}

    </div>
  );
}
