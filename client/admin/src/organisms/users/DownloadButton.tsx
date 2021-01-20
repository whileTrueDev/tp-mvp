import React, { useCallback, memo } from 'react';
import { BroadcastDataForDownload } from '@truepoint/shared/dist/interfaces/BroadcastDataForDownload.interface';
import axios from 'axios';
import { Button } from '@material-ui/core';

import getApiHost from '../../util/getApiHost';

// 편집점 다운로드 요청 url
const apiUrl = `${getApiHost()}/highlight/export`;

interface DownloadButtonProps extends BroadcastDataForDownload{
  ext: string; // 확장자, srt | csv
}

// UserBroadCast 내에서 csv 다운로드, srt 다운로드 컬럼에서 사용되는 컴포넌트
function DownloadButton(props: DownloadButtonProps): JSX.Element {
  const {
    ext, creatorId, platform, streamId,
  } = props;

  const csv = (ext === 'csv') ? 1 : 0;
  const srt = (ext === 'srt') ? 1 : 0;
  const exportCategory = 'highlight';
  const exportFileName = '편집점';

  const download = useCallback(() => {
    axios.get(apiUrl, {
      responseType: 'blob',
      params: {
        creatorId,
        platform,
        streamId,
        exportCategory,
        srt,
        csv,
      },
    }).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/zip' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${exportFileName}.zip`);
      link.click();
    }).catch((e) => {
      console.error('다운로드 에러', e);
    });
  }, []);

  return (
    <Button
      variant="contained"
      onClick={download}
    >
      {`.${ext}`}
    </Button>
  );
}

export default memo(DownloadButton);
