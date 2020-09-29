import React from 'react';
import {
  Typography, Paper, Divider, Button,
} from '@material-ui/core';
// import { NoticeData } from '../pages/AdminNotice';

const Markdown = require('react-markdown');

interface NoticeData {
  title?: string;
  code?: number;
  categori?: string;
  regiDate: string;
  contents?: string;
  isImportant?: boolean;
}

interface Props {
  selectedData: NoticeData; 
  handleEditModeOn: () => void;
}
export default function NoticePreview(props: Props) {
  const { selectedData, handleEditModeOn } = props;
  return (
    <Paper>
      <div style={{ padding: 28 }}>
        <Typography variant="h4">
          {selectedData.title}
        </Typography>

        <div style={{ display: 'flex', marginTop: 10, justifyContent: 'space-bwtween' }}>
        <Typography variant="subtitle1">
            {`글번호 : ${selectedData.code},`}
                    &emsp;
          </Typography>
          <Typography variant="subtitle1">
            {`${selectedData.categori},`}
                    &emsp;
          </Typography>
          <Typography variant="subtitle1">
            {new Date(selectedData.regiDate).toLocaleString()}
          </Typography>
        </div>

        {selectedData.contents && (
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
                  window.location.reload();
                }
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
          source={selectedData.contents}
          escapeHtml={false}
          renderers={{ code: ({ value }: {value: any}) => <Markdown source={value} /> }}
        />
      </div>

    </Paper>
  );
}
