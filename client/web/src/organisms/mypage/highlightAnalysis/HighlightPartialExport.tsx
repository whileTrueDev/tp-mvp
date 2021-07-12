import { Button, Typography } from '@material-ui/core';
import React, { useCallback } from 'react';

export interface HighlightPartialExportProps{
  time: {
    hour: number,
    minute: number,
    seconds: number,
  },
  handleTimeChange: (e: React.FormEvent<HTMLInputElement>) => void,
  handleExportClick: () => Promise<void>,
}
export default function HighlightPartialExport(props: HighlightPartialExportProps): JSX.Element {
  const { time, handleTimeChange: handleChange, handleExportClick } = props;

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
        href="https://truepoint.s3.ap-northeast-2.amazonaws.com/tp-introduction/201014+%E1%84%90%E1%85%B3%E1%84%85%E1%85%AE%E1%84%91%E1%85%A9%E1%84%8B%E1%85%B5%E1%86%AB%E1%84%90%E1%85%B3+%E1%84%89%E1%85%A5%E1%84%87%E1%85%B5%E1%84%89%E1%85%B3+%E1%84%8C%E1%85%B5%E1%86%AB%E1%84%92%E1%85%A2%E1%86%BC+%E1%84%80%E1%85%A9%E1%86%BC%E1%84%8B%E1%85%B2%E1%84%8B%E1%85%AD%E1%86%BC++(1).pdf"
        // 임시로 아무거나 붙여놓은 링크임. 추후 이미지 전달받으면 변경하기
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
            disabled={!time.hour && !time.minute && !time.seconds}
            onClick={submit}
          >
            부분 영상 편집점 내보내기

          </Button>
        </form>
      </div>

    </div>
  );
}
