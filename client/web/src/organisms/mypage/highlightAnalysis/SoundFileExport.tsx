import { Button, CircularProgress, Typography } from '@material-ui/core';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import React from 'react';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import {
  downloadFile,
  HighlightExportProps,
} from '../../../utils/hooks/useHighlightExport';

export default function SoundFileExport(props: HighlightExportProps): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const { selectedStream, exportCategory } = props;
  const [{ loading }, downloadSoundFile] = useAxios({
    url: '/highlight/full-sound-file',
    method: 'get',
    responseType: 'blob',
  }, { manual: true });

  const download = () => {
    if (selectedStream) {
      const { streamId, platform, creatorId } = selectedStream;
      downloadSoundFile({
        params: {
          streamId, platform, creatorId, exportCategory,
        },
      }).then((res) => {
        const exportFileName = '풀영상 사운드 파일';
        downloadFile(res.data, exportFileName);
      }).catch((error) => {
        if (error.response && error.response.status === 404) {
          console.error({ ...error });
          // 오디오 파일이 존재하지 않는 경우
          ShowSnack('사운드 파일이 존재하지 않습니다!', 'error', enqueueSnackbar);
        } else {
          ShowSnack('오류가 발생하였습니다. 고객센터로 문의해주세요.', 'error', enqueueSnackbar);
        }
      });
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
