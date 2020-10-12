import React from 'react';
import Markdown from 'react-markdown/with-html';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Paper, Typography } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { NoticeData } from '../../../interfaces/Notice';

const useStyles = makeStyles((theme) => ({
  markdown: { fontSize: theme.typography.body1.fontSize, },
  title: {
    padding: theme.spacing(4),
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #ddd',
  },
  titleText: { textTransform: 'none', fontWeight: 'bold' },
  contentsText: { padding: theme.spacing(4), minHeight: 400 },
  buttonSet: {
    padding: `${theme.spacing(4)}px 0px`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
}));

export interface NoticeDetailProps {
  data: NoticeData[];
  selectedNoticeId: string;
  onBackClick: () => void;
  onOtherNoticeClick: (num:number) => void;
}
export default function NoticeDetail({
  data, onBackClick, selectedNoticeId,
  onOtherNoticeClick
}:NoticeDetailProps): JSX.Element {
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

  return (
    <div>
      <Paper component="article">
        <div className={classes.title}>
          <Typography variant="h6" className={classes.titleText}>
            {currentNotice?.title}
          </Typography>
          <Typography color="textSecondary">
            {`${currentNotice?.category} • ${
              new Date(currentNotice!.createdAt).toLocaleString()}`}
          </Typography>
        </div>

        <div className={classes.contentsText}>
          <Markdown
            className={classes.markdown}
            source={currentNotice?.content}
            escapeHtml={false}
            renderers={{ code: ({ value }) => <Markdown source={value} /> }}
          />
        </div>
      </Paper>

      <div id="button-set" className={classes.buttonSet}>
        <Button
          style={{ width: '25%' }}
          size="large"
          disabled={currentNoticeIndex === 0}
          variant="contained"
          color="primary"
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
          variant="contained"
          onClick={() => { onBackClick(); }}
        >
          목록으로
        </Button>
        <Button
          style={{ width: '25%' }}
          size="large"
          disabled={currentNoticeIndex === data.length - 1}
          variant="contained"
          color="primary"
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
