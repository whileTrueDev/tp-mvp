import React from 'react';
import {
  Typography, Paper, CircularProgress,
} from '@material-ui/core';

export default function NoticeMarkdownHelper(): JSX.Element {
  const [iframeLoading, setIframeLoading] = React.useState(true);

  return (
    <div>
      <Typography variant="h4">
        마크다운 작성 도움말
      </Typography>
      {iframeLoading && (<CircularProgress />) }
      <Paper>
        <div style={{ marginBottom: 20 }}>
          <Typography>색상을 사용하고싶다? (강조표시를 색상이 적용된 글에도 가능)</Typography>
          <Typography>{'<span style="color: red">색칠할 글</span>'}</Typography>
        </div>
        <iframe
          width="100%"
          height="680"
          title="마크다운 작성 도움말"
          onLoad={() => {
            setIframeLoading(false);
          }}
          src="https://jmhmunhwan.github.io/devlog/2019/02/15/Markdown/"
          frameBorder="0"
        />
      </Paper>
      <Typography variant="caption">출처: https://jmhmunhwan.github.io/devlog/2019/02/15/Markdown/</Typography>

    </div>
  );
}
