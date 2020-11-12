import React, { useEffect, useRef } from 'react';
import Markdown from 'react-markdown/with-html';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Paper, Typography } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { Notice as NoticeData } from '@truepoint/shared/dist/interfaces/Notice.interface';
// 날짜표현 컴포넌트 추가
import dateExpression from '../../../utils/dateExpression';

const useStyles = makeStyles((theme) => ({
  markdown: { fontSize: theme.typography.body1.fontSize },
  title: {
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  titleText: { textTransform: 'none', fontWeight: 'bold' },
  contentsText: { padding: theme.spacing(4), minHeight: 400 },
  buttonSet: {
    padding: `${theme.spacing(4)}px 0px ${theme.spacing(2)}px`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

export interface NoticeDetailProps {
  data: NoticeData[];
  selectedNoticeId: string;
  onBackClick: () => void;
  onOtherNoticeClick: (num: number) => void;
}
export default function NoticeDetail({
  data, onBackClick, selectedNoticeId,
  onOtherNoticeClick,
}: NoticeDetailProps): JSX.Element {
  const classes = useStyles();

  // length of title to render on Next/Previous button
  const TITLE_LENGTH = 15;

  // Current Notice
  const currentNotice = data.find((d) => d.id === Number(selectedNoticeId));
  const currentNoticeIndex = data.findIndex((d) => d.id === Number(selectedNoticeId));

  // Previous Notice
  const previousNotice = data[currentNoticeIndex - 1];

  // Next Notice
  const nextNotice = data[currentNoticeIndex + 1];

  // 스크롤 상단으로
  const paperRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (paperRef.current) {
      window.scrollTo(0, paperRef.current.scrollHeight + 70);
    }
  });

  return (
    <div>
      <Paper component="article" ref={paperRef}>
        {/* 공지사항 제목 및 메타데이터 */}
        <div className={classes.title}>
          <Typography variant="h6" className={classes.titleText}>
            {currentNotice?.title}
          </Typography>
          <Typography color="textSecondary" component="div">
            <Typography>
              {currentNotice?.category}
            </Typography>
            <Typography>
              {dateExpression({
                compoName: 'selected-view',
                createdAt: currentNotice?.createdAt,
              })}
            </Typography>
          </Typography>
        </div>

        {/* 공지사항 내용 */}
        <div className={classes.contentsText}>
          <Markdown
            className={classes.markdown}
            source={currentNotice?.content}
            escapeHtml={false}
            // eslint-disable-next-line react/prop-types
            renderers={{ code: ({ value }) => <Markdown source={value} /> }}
          />
        </div>
      </Paper>

      {/* 이전글, 다음글, 목록 버튼 셋 */}
      <div id="button-set" className={classes.buttonSet}>
        <Button
          style={{ width: '30%' }}
          size="large"
          disabled={currentNoticeIndex === 0}
          variant="outlined"
          onClick={() => {
            onOtherNoticeClick(previousNotice.id);
          }}
        >
          <KeyboardArrowLeft />
          {currentNoticeIndex !== 0 && (
            <Typography>
              {previousNotice.title.length > TITLE_LENGTH
                ? `${previousNotice.title.slice(0, TITLE_LENGTH)}...`
                : previousNotice.title}
            </Typography>
          )}
        </Button>
        <Button
          style={{ width: '10%' }}
          size="large"
          variant="outlined"
          onClick={() => {
            onBackClick();
          }}
        >
          목록
        </Button>
        <Button
          style={{ width: '30%' }}
          size="large"
          disabled={currentNoticeIndex === data.length - 1}
          variant="outlined"
          onClick={() => {
            onOtherNoticeClick(nextNotice.id);
          }}
        >
          {currentNoticeIndex !== data.length - 1 && (
            <Typography>
              {nextNotice.title.length > TITLE_LENGTH
                ? `${nextNotice.title.slice(0, TITLE_LENGTH)}...`
                : nextNotice.title}
            </Typography>
          )}
          <KeyboardArrowRight />
        </Button>
      </div>
    </div>
  );
}
