import { Button, CircularProgress, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import { SoundFileExportParams, useSoundFileExportQuery } from '../../../utils/hooks/query/useSoundFileExportQuery';
import {
  downloadFile,
  HighlightExportProps,
} from '../../../utils/hooks/useHighlightExport';

export default function SoundFileExport(props: HighlightExportProps): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const { selectedStream, exportCategory } = props;

  const [enableExport, setEnableExport] = useState<boolean>(false);
  const [params, setParams] = useState<SoundFileExportParams>({
    streamId: '',
    platform: 'afreeca',
    creatorId: '',
    exportCategory,
  });

  const { isFetching: loading } = useSoundFileExportQuery(params, {
    enabled: enableExport,
    onSuccess: (result) => {
      const exportFileName = selectedStream ? `${selectedStream.startDate} 방송` : '';
      downloadFile(result, exportFileName, 'mp3');
      setEnableExport(false); // enable false로 초기화
    },
    onError: (error) => {
      console.error(error);
      if (error.response && error.response.status === 403) {
        // 오디오 수집 대상자가 아닌 경우
        ShowSnack('사운드 파일 수집 대상자가 아닙니다! 사운드 파일 기능을 이용하고 싶으시면 고객센터로 문의해주세요.', 'error', enqueueSnackbar);
      } else if (error.response && error.response.status === 404) {
        // 오디오 파일이 존재하지 않는 경우
        ShowSnack('사운드 파일이 존재하지 않습니다!', 'error', enqueueSnackbar);
      } else {
        ShowSnack('오류가 발생하였습니다. 고객센터로 문의해주세요.', 'error', enqueueSnackbar);
      }
    },
  });
  const download = () => {
    if (selectedStream) {
      const { streamId, platform, creatorId } = selectedStream;
      setParams({
        streamId, platform, creatorId, exportCategory,
      });
      setEnableExport(true);
    }
  };
  return (
    <div>
      <Typography>
        사운드 파일 싱크로나이즈 기능 활용시 내보내기 해주세요
      </Typography>
      <Button variant="outlined" onClick={download}>
        풀 영상 사운드 파일 내보내기
        {loading && (
        <CircularProgress
          disableShrink
          size={10}
          thickness={5}
          variant="indeterminate"
        />
        )}
      </Button>
    </div>
  );
}
