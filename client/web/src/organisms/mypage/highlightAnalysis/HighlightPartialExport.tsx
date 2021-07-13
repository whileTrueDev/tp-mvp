import { Button, Typography } from '@material-ui/core';
import React, { useCallback } from 'react';

export interface HighlightPartialExportProps{
  time: {
    hour: number,
    minute: number,
    seconds: number,
  },
  isChecked: {
    srtCheckBox: boolean;
    csvCheckBox: boolean;
  },
  handleTimeChange: (e: React.FormEvent<HTMLInputElement>) => void,
  handleExportClick: () => Promise<void>,
}
export default function HighlightPartialExport(props: HighlightPartialExportProps): JSX.Element {
  const {
    time, handleTimeChange: handleChange, handleExportClick, isChecked,
  } = props;

  const submit = useCallback(() => {
    if (!time.hour && !time.minute && !time.seconds) {
      return;
    }
    handleExportClick();
  }, [handleExportClick, time.hour, time.minute, time.seconds]);
  return (
    <div>
      <Typography gutterBottom style={{ marginBottom: 32 }}>
        <Typography component="span" color="secondary">풀영상이 아닌 </Typography>
        부분 영상 파일을 다루고 계시면 아래 기능을 활용해주세요!!
      </Typography>
      <a
        href="https://drive.google.com/file/d/1d5ilSrz4GJxPbNWODufVpbA8BXKTOhxv/view?usp=sharing"
        download
        target="_blank"
        rel="noreferrer"
        style={{
          color: 'green', display: 'block', marginBottom: 32, fontSize: '1rem',
        }}
      >
        (반드시 확인!) 부분 영상에 편집점 적용하는 방법
      </a>

      <div style={{ marginBottom: 32 }}>
        <Typography>풀 영상 기준, 부분 영상의 시작 시간을 입력 후 내보내기 해주세요</Typography>
        <Typography>시간이 보정된 편집점 파일을 받으실 수 있습니다</Typography>
        <form
          style={{ border: '1px solid lightblue', display: 'inline-block', padding: 8 }}
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >

          <label htmlFor="hour">
            <input
              value={time.hour}
              id="hour"
              name="hour"
              type="number"
              style={{ padding: '5px', border: '1px solid rgba(0, 0, 0, 0.23)', borderRadius: 4 }}
              min="0"
              max="999"
              onChange={handleChange}
            />
            시
          </label>

          <label htmlFor="minute">
            <input
              value={time.minute}
              id="minute"
              name="minute"
              type="number"
              style={{ padding: '5px', border: '1px solid rgba(0, 0, 0, 0.23)', borderRadius: 4 }}
              min="0"
              max="59"
              onChange={handleChange}
            />
            분
          </label>

          <label htmlFor="seconds">
            <input
              value={time.seconds}
              id="seconds"
              name="seconds"
              type="number"
              style={{ padding: '5px', border: '1px solid rgba(0, 0, 0, 0.23)', borderRadius: 4 }}
              min="0"
              max="59"
              onChange={handleChange}
            />
            초
          </label>
          <Button
            style={{ marginLeft: 32 }}
            variant="outlined"
            disabled={(!time.hour && !time.minute && !time.seconds)
              || !(isChecked.srtCheckBox || isChecked.csvCheckBox)}
            onClick={submit}
          >
            부분 영상 편집점 내보내기

          </Button>
        </form>
      </div>

    </div>
  );
}
