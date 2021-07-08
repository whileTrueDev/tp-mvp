import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import ShowSnack from '../../atoms/snackbar/ShowSnack';
import { HighlightExportProps } from '../../organisms/shared/sub/HighlightExport';

type StartTime = {
  hour: number,
  minute: number,
  seconds: number
}
type CheckboxState = {
  srtCheckBox: boolean;
  csvCheckBox: boolean;
};

type Return = {
  isChecked: CheckboxState,
  setIsChecked: React.Dispatch<React.SetStateAction<CheckboxState>>,
  handleCheckbox: (e: React.ChangeEvent<HTMLInputElement>) => void,
  handleExportClick: () => Promise<void>,
  time: StartTime,
  setTime: React.Dispatch<React.SetStateAction<StartTime>>,
  handleTimeChange: (e: React.FormEvent<HTMLInputElement>) => void,
}

export const padLeft = (value: number, length = 2): string => value.toString().padStart(length, '0');

function startTimeFormatter(time: StartTime): string {
  const { hour, minute, seconds } = time;
  if (!hour || !minute || !seconds) return '';
  return `${padLeft(hour)}:${padLeft(minute)}:${padLeft(seconds)},000`;
}

export default function useHighlightExport(
  { selectedStream, exportCategory }: HighlightExportProps,
): Return {
  const { enqueueSnackbar } = useSnackbar();

  const [time, setTime] = useState<StartTime>({
    hour: 0,
    minute: 0,
    seconds: 0,
  });

  const handleTimeChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    const { value, min, max } = target;
    if (Number(value) > Number(max) || Number(value) < Number(min)) return;
    setTime((prevTime) => ({ ...prevTime, [target.name]: Number(value) }));
  };

  const [isChecked, setIsChecked] = useState({
    srtCheckBox: true,
    csvCheckBox: true,
    // txtCheckBox: true,
  });

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked({ ...isChecked, [e.target.name]: e.target.checked });
  };

  // 편집점 내보내기 요청
  const [, doExport] = useAxios(
    { url: '/highlight/export', method: 'get', responseType: 'blob' }, { manual: true },
  );

  let exportFileName = '트루포인트 편집점';

  switch (exportCategory) {
    case 'chat':
      exportFileName = '[채팅수] 기반 편집점';
      break;
    case 'funny':
      exportFileName = '[웃음수] 기반 편집점';
      break;
    case 'agree':
      exportFileName = '[모두가 인정한] 카테고리 편집점';
      break;
    case 'disgust':
      exportFileName = '[역겨운] 카테고리 편집점';
      break;
    case 'surprise':
      exportFileName = '[놀라운] 카테고리 편집점';
      break;
    case 'question':
      exportFileName = '[의문이 드는] 카테고리 편집점';
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
      // const txt = isChecked.txtCheckBox ? 1 : 0;

      const startTime = startTimeFormatter(time);
      doExport({
        params: {
          creatorId, platform, streamId, exportCategory, srt, csv, startTime,
          // txt
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

  return {
    isChecked,
    setIsChecked,
    handleCheckbox,
    handleExportClick,
    time,
    setTime,
    handleTimeChange,
  };
}
