import React from 'react';
import {
  Typography, Paper, Divider, Button,
} from '@material-ui/core';
import useAxios from 'axios-hooks';
import Markdown from 'react-markdown';

/* 
Props
*****************************************************************************
dataPreView를 위한 Props입니다.
*****************************************************************************
selectedData: tableData배열중 선택된 1개의 객체타입의 데이터에대한 속성값을 전달받습니다.
handleEditModeON: 글 편집기 컴포넌트를 렌더링하기 위한 핸들러를 전달받습니다.
handleReload: 글 목록 게시글에 변경사항이 있을경우 리 렌더링하기위한 핸들러 함수를 전달 받습니다.
*****************************************************************************
*/
interface Props {
  selectedData: any;
  handleEditModeOn: () => void;
  handleReload: () => void;
}

/* 
DataPreView
************************************************************************
<개요>
공지사항에 사용되는 데이터 개별보기를 위한 컴포넌트 입니다.
<백엔드요청목록>
url: '/notice', method: 'DELETE'
************************************************************************
1. 개별 데이터의 정보가 표시됩니다.
2. 수정하기 버튼 클릭시 handleEditModeON 핸들러를 이용해 글 편집 컴포넌트를 랜더링시킵니다.
3. 삭제하기 버튼 클릭시 백엔드로 delete 요청을 보낸다음 hadndleReload 핸들러를 통해 변경된
공지사항 목록 데이터를 리랜더링합니다.
4. Markdown 컴포넌트를 통해 데이터의 content를 표시합니다.
************************************************************************
*/

export default function DataPreView(props: Props): JSX.Element {
  const { selectedData, handleEditModeOn, handleReload } = props;

  // 데이터 가져오기
  const [, executeDelete] = useAxios(
    { url: '/notice', method: 'DELETE' }, { manual: true },
  );

  return (
    <Paper>
      <div style={{ padding: 28 }}>
        <Typography variant="h4">
          {selectedData.title}
        </Typography>

        <div style={{ display: 'flex', marginTop: 10, justifyContent: 'space-bwtween' }}>
          <Typography variant="subtitle1">
            {`글번호 : ${selectedData.id},`}
            &emsp;
          </Typography>
          <Typography variant="subtitle1">
            {`${selectedData.category},`}
            &emsp;
          </Typography>
          <Typography variant="subtitle1">
            {`중요공지여부 : ${selectedData.isImportant}`}
          </Typography>
        </div>

        {selectedData.content && (
          <div>
            <Button
              style={{ marginLeft: 5, marginRight: 5 }}
              color="primary"
              variant="contained"
              onClick={handleEditModeOn}
            >
              글 수정 하기
            </Button>

            <Button
              style={{ marginLeft: 5, marginRight: 5 }}
              color="secondary"
              variant="contained"
              onClick={() => {
                if (window.confirm(`정말로\n${selectedData.title}\n공지글을 삭제하시겠습니까?`)) {
                  executeDelete({
                    data: selectedData,
                  }).then((res) => {
                    handleReload();
                  }).catch((err) => {
                    console.error('err', err.response);
                  });
                }
                window.location.reload();
              }}
            >
              삭제하기
            </Button>
          </div>
        )}

      </div>

      <Divider />

      <div style={{ padding: 28, maxHeight: 750, overflow: 'scroll' }}>
        <Markdown
          source={selectedData.content}
          escapeHtml={false}
          renderers={{ code: ({ value }: {value: any}) => <Markdown source={value} /> }}
        />
      </div>

    </Paper>
  );
}
