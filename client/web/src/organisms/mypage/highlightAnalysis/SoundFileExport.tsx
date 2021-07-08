import { Button, Typography } from '@material-ui/core';
import React from 'react';

export default function SoundFileExport(): JSX.Element {
  const download = () => {
    // console.log('sound file download');
  };
  return (
    <div>
      <Typography>
        사운드 파일 싱크로나이즈 기능 활용시 내보내기 해주세요
      </Typography>
      <Button variant="outlined" onClick={download}>풀 영상 사운드 파일 내보내기</Button>
    </div>
  );
}
