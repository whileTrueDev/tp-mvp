import React from 'react';
import { makeStyles } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import useAxios from 'axios-hooks';
import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';
import { useSnackbar } from 'notistack';
import HelperPopOver from '../HelperPopOver';
import Button from '../../../atoms/Button/Button';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';

const useStyle = makeStyles(() => ({
  helperPopOver: { textAlign: 'right' },
}));

interface HighlightExportProps {
  selectedStream: StreamDataType | null,
  exportCategory: string,
}

export default function HighlightExport(
  { selectedStream, exportCategory }: HighlightExportProps,
): JSX.Element {
  const classes = useStyle();
  const { enqueueSnackbar } = useSnackbar();

  const [isChecked, setIsChecked] = React.useState({
    srtCheckBox: true,
    csvCheckBox: true,
    txtCheckBox: true,
  });

  // 편집점 내보내기 요청
  const [, doExport] = useAxios(
    { url: '/highlight/export', method: 'get', responseType: 'blob' }, { manual: true },
  );

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked({ ...isChecked, [e.target.name]: e.target.checked });
  };

  let exportFileName = '트루포인트 편집점';
  switch (exportCategory) {
    case 'chat':
      exportFileName = '채팅수 기반 편집점';
      break;
    case 'smile':
      exportFileName = '웃음수 기반 편집점';
      break;
    case 'funny':
      exportFileName = '웃긴 카테고리 편집점';
      break;
    case 'agree':
      exportFileName = '모두가 인정한 카테고리 편집점';
      break;
    case 'disgust':
      exportFileName = '역겨운 카테고리 편집점';
      break;
    case 'surprise':
      exportFileName = '놀라운 카테고리 편집점';
      break;
    case 'question':
      exportFileName = '의문이 드는 카테고리 편집점';
      break;
    default:
      break;
  }

  // 편집점 내보내기 버튼 클릭 시 실행함수
  const handleExportClick = async () => {
    if (selectedStream) {
      const { streamId, platform, creatorId } = selectedStream;
      const srt = isChecked.srtCheckBox ? 1 : 0;
      const csv = isChecked.csvCheckBox ? 1 : 0;
      const txt = isChecked.txtCheckBox ? 1 : 0;

      doExport({
        params: {
          creatorId, platform, streamId, exportCategory, srt, txt, csv,
        },
      })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/zip' }));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${exportFileName}.zip`);
          document.body.appendChild(link);
          link.click();
        }).catch((err) => {
          console.error(err);
          ShowSnack('지금은 다운로드 할 수 없습니다.', 'error', enqueueSnackbar);
        });
    } else {
      ShowSnack('내보내기 할 방송을 선택해주세요.', 'error', enqueueSnackbar);
    }
  };

  return (
    <div>
      <div className={classes.helperPopOver}>
        <HelperPopOver />
      </div>
      <div>
        <FormControlLabel
          control={(
            <Checkbox
              checked={isChecked.srtCheckBox}
              onChange={handleCheckbox}
              name="srtCheckBox"
              color="primary"
            />
          )}
          label="srt"
        />
        <FormControlLabel
          control={(
            <Checkbox
              checked={isChecked.txtCheckBox}
              onChange={handleCheckbox}
              name="txtCheckBox"
              color="primary"
            />
          )}
          label="csv"
        />

        <FormControlLabel
          control={(
            <Checkbox
              checked={isChecked.csvCheckBox}
              onChange={handleCheckbox}
              name="csvCheckBox"
              color="primary"
            />
          )}
          label="txt"
        />
        <Button
          onClick={handleExportClick}
          disabled={!(isChecked.srtCheckBox || isChecked.csvCheckBox || isChecked.txtCheckBox)}
        >
          편집점 내보내기
        </Button>
      </div>
    </div>
  );
}
