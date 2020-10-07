import React ,{useEffect, useState} from 'react';
import {
  Typography, Paper, Divider, Button,
} from '@material-ui/core';
// import { NoticeData } from '../pages/AdminNotice';
import useAxios from 'axios-hooks';

const Markdown = require('react-markdown');

interface NoticeData {
  title?: string;
  id?: number;
  category?: string;
  createdAt: string;
  content?: string;

}

interface Props {
  selectedData: NoticeData; 
  handleEditModeOn: () => void;
}

export default function NoticePreview(props: Props) {
  const { selectedData, handleEditModeOn } = props;
  
  //데이터 가져오기
  const [{ error, loading, data }, executeDelete] = useAxios(
    { url:'http://localhost:3000/admin/notice', method: 'DELETE'}, { manual: true }
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
            {new Date(selectedData.createdAt).toLocaleString()}
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
                  console.log(selectedData.id);
                  executeDelete({
                    data: selectedData
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
