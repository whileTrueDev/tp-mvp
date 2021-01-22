import React, { memo } from 'react';
import { BroadcastDataForDownload } from '@truepoint/shared/dist/interfaces/BroadcastDataForDownload.interface';
import axios from 'axios';
import { Button } from '@material-ui/core';

import getApiHost from '../../../util/getApiHost';

interface DownloadButtonProps extends BroadcastDataForDownload{
  ext: string; // 확장자, srt | csv
}

interface DownloadRequestParamType {
creatorId: string;
platform: string;
streamId: string;
exportCategory: string;
srt: number;
csv: number;
}

// 편집점 다운로드 함수
function requestDownload(requestParams: DownloadRequestParamType, fileName: string) {
  axios.get(`${getApiHost()}/highlight/export`, {
    responseType: 'blob',
    params: requestParams,
  }).then((res) => {
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/zip' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}.zip`);
    link.click();
  }).catch((e) => {
    console.error('다운로드 에러', e);
  });
}

// UserBroadCast 내에서 csv 다운로드, srt 다운로드 컬럼에서 사용되는 컴포넌트
function DownloadButton(props: DownloadButtonProps): JSX.Element {
  const {
    ext, creatorId, platform, streamId, title, endDate,
  } = props;

  const reqParams: DownloadRequestParamType = {
    creatorId,
    platform,
    streamId,
    exportCategory: 'highlight',
    srt: Number(ext === 'srt'),
    csv: Number(ext === 'csv'),
  };
  const exportFileName = `${creatorId}_${title}_${endDate}`;
  function downloadFile() {
    requestDownload(reqParams, exportFileName);
  }

  return (
    <Button
      variant="contained"
      onClick={downloadFile}
    >
      {`.${ext}`}
    </Button>
  );
}

export default memo(DownloadButton);
