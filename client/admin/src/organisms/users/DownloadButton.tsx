import React from 'react';
import { Button } from '@material-ui/core';

// UserBroadCast 내에서 csv 다운로드, srt 다운로드 컬럼에서 사용되는 컴포넌트
// 
function DownloadButton(props: Record<string, any>): JSX.Element {
  const {
    srt, csv, ext, title,
  } = props;

  // 확장자에 따라 다른 url 사용
  const url = (ext === 'srt')
    ? srt
    : csv;

  function download() {
    fetch(url).then((res) => {
      res.blob().then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `${title}.${ext}`; // 다운로드 될 파일이름 : 제목.확장자
        a.click();
      });
    });
  }
  return (
    <Button
      variant="contained"
      onClick={download}
    >
      {`${ext}`}
    </Button>
  );
}

export default DownloadButton;
