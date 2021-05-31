import React, { useEffect, useRef } from 'react';
import Markdown from 'react-markdown/with-html';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button, Grid, Paper, Typography,
} from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { Notice as NoticeData } from '@truepoint/shared/dist/interfaces/Notice.interface';
// 날짜표현 컴포넌트 추가
import dateExpression from '../../../utils/dateExpression';
import useMediaSize from '../../../utils/hooks/useMediaSize';

const useStyles = makeStyles((theme) => ({
  markdown: { fontSize: theme.typography.body1.fontSize },
  title: {
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2, 1),
    },
  },
  titleRow: {},
  metaRow: {},
  titleText: { textTransform: 'none', fontWeight: 'bold' },
  contentsText: {
    padding: theme.spacing(4),
    minHeight: 400,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2, 1),
    },
  },
  buttonSet: {
    padding: `${theme.spacing(4)}px 0px ${theme.spacing(2)}px`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      '&>button': {
        width: 'auto',
      },
    },
  },
  secretText: {
    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 300,
  },
  pageButton: { width: '300px' },
  listButton: { width: '100px' },
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
  const { isMobile } = useMediaSize();

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

  if (!currentNotice) {
    return (
      <Paper
        component="article"
        className={classes.secretText}
      >
        <Typography>죄송합니다. 삭제된 글이거나 글을 읽어오지 못했습니다.</Typography>
        <Button
          className={classes.listButton}
          style={{ margin: 8 }}
          size="large"
          variant="outlined"
          onClick={onBackClick}
        >
          목록
        </Button>
      </Paper>
    );
  }

  return (
    <div>
      <Paper component="article" ref={paperRef}>
        {/* 공지사항 제목 및 메타데이터 */}
        <Grid container className={classes.title}>
          <Grid item className={classes.titleRow}>
            <Typography variant="h6" className={classes.titleText}>
              {currentNotice && currentNotice.title}
            </Typography>
          </Grid>
          <Grid item className={classes.metaRow}>
            <Typography color="textSecondary" component="div">
              {currentNotice?.category}
            </Typography>
            <Typography color="textSecondary">
              {dateExpression({
                compoName: 'selected-view',
                createdAt: currentNotice?.createdAt,
              })}
            </Typography>
          </Grid>

        </Grid>

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
          className={classes.pageButton}
          size="large"
          disabled={currentNoticeIndex === 0}
          variant="outlined"
          onClick={() => {
            onOtherNoticeClick(previousNotice.id);
          }}
        >
          <KeyboardArrowLeft />
          {currentNoticeIndex !== 0 && !isMobile && (
            <Typography>
              {previousNotice.title.length > TITLE_LENGTH
                ? `${previousNotice.title.slice(0, TITLE_LENGTH)}...`
                : previousNotice.title}
            </Typography>
          )}
        </Button>
        <Button
          className={classes.listButton}
          size="large"
          variant="outlined"
          onClick={() => {
            onBackClick();
          }}
        >
          목록
        </Button>
        <Button
          className={classes.pageButton}
          size="large"
          disabled={currentNoticeIndex === data.length - 1}
          variant="outlined"
          onClick={() => {
            onOtherNoticeClick(nextNotice.id);
          }}
        >
          {currentNoticeIndex !== data.length - 1 && !isMobile && (
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
