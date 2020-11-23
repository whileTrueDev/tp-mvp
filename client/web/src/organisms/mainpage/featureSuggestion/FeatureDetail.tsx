import React, { useEffect, useRef } from 'react';
import useAxios from 'axios-hooks';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button, Paper, Typography, Chip,
} from '@material-ui/core';
import {
  Create, Delete, KeyboardArrowLeft, KeyboardArrowRight,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { FeatureSuggestion } from '@truepoint/shared/dist/interfaces/FeatureSuggestion.interface';
// import Divider from '@material-ui/core/Divider';
// import Card from '../../../atoms/Card/Card';
import { Viewer } from '@toast-ui/react-editor';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import transformIdToAsterisk from '../../../utils/transformAsterisk';

import dateExpression from '../../../utils/dateExpression';
import FeatureReplyInput from './sub/FeatureReplyInput';
import FeatureReply from './sub/FeatureReply';

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
  contentsText: { padding: theme.spacing(4), minHeight: 300 },
  buttonSet: {
    padding: `${theme.spacing(4)}px 0px ${theme.spacing(2)}px`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editDeleteButtonSet: {
    padding: theme.spacing(1),
    textAlign: 'right',
  },
  editDeleteButton: { borderRadius: 0 },
}));

export interface FeatureDetailProps {
  data: FeatureSuggestion[];
  selectedSuggestionId: string;
  onBackClick: () => void;
  onOtherFeatureClick: (num: number) => void;
  refetch: () => void;
}
export default function FeatureDetail({
  data, onBackClick, selectedSuggestionId,
  onOtherFeatureClick, refetch,
}: FeatureDetailProps): JSX.Element {
  const classes = useStyles();
  const authContext = useAuthContext();

  const [, deleteRequest] = useAxios(
    { url: '/feature-suggestion', method: 'delete' }, { manual: true },
  );
  // length of title to render on Next/Previous button
  const TITLE_LENGTH = 15;

  // Current Feature
  const currentSuggestion = data.find((d) => d.suggestionId === Number(selectedSuggestionId))!; // 선택된 기능제안 글은 언제나 있으므로, type assertion.
  const currentSuggestionIndex = data.findIndex((d) => d.suggestionId === Number(selectedSuggestionId));
  // Previous Feature
  const previousFeature = data[currentSuggestionIndex - 1];

  // Next Feature
  const nextFeature = data[currentSuggestionIndex + 1];

  const doDelete = () => {
    const doConfirm = window.confirm('삭제 하시겠습니까?');
    if (doConfirm) {
      deleteRequest({ params: { data: currentSuggestion.suggestionId } });
      window.location.replace('/feature-suggestion');
    }
  };

  // 스크롤 상단으로
  const paperRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (paperRef.current) {
      window.scrollTo(0, paperRef.current.scrollHeight + 100);
    }
  });

  // 기능제안 상태 Chip 렌더링을 위해
  const progressTab = (value: number) => {
    switch (value) {
      case 1: return (<Chip color="secondary" label="개발 확정" />);
      case 2: return (<Chip color="primary" label="개발보류" />);
      default: return (<Chip variant="outlined" label="미확인" />);
    }
  };

  return (
    <div>
      <Paper component="article" ref={paperRef}>
        <div className={classes.title}>
          <div>
            <Typography component="div" variant="h6" className={classes.titleText}>
              {currentSuggestion.title}
              {' '}
              {progressTab(currentSuggestion.state)}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {currentSuggestion.author && (
                <span>
                  {authContext.user.userId === currentSuggestion.author
                    ? currentSuggestion.author
                    : transformIdToAsterisk(currentSuggestion.author, 1.8)}
                </span>
              )}
            </Typography>
          </div>
          <Typography color="textSecondary" component="div">
            <Typography>
              {currentSuggestion.category}
            </Typography>
            <Typography>
              {dateExpression({
                compoName: 'selected-view',
                createdAt: currentSuggestion?.createdAt,
              })}
            </Typography>
          </Typography>
        </div>
        {currentSuggestion.author === authContext.user.userId
        && (
          <div className={classes.editDeleteButtonSet}>
            <Button
              className={classes.editDeleteButton}
              component={Link}
              to={{
                pathname: `/feature-suggestion/write/${currentSuggestion.suggestionId}`,
                state: [currentSuggestion],
              }}
              variant="outlined"
            >
              <Create />
              수정
            </Button>
            <Button
              className={classes.editDeleteButton}
              variant="outlined"
              onClick={doDelete}
            >
              <Delete />
              삭제
            </Button>
          </div>
        )}
        <div className={classes.contentsText}>
          <div className={classes.markdown}>
            <Viewer initialValue={currentSuggestion.content} />
          </div>
        </div>
      </Paper>

      {/* 댓글 작성하기 */}
      {currentSuggestion.author === authContext.user.userId && (
        <FeatureReplyInput currentSuggestion={currentSuggestion} refetch={refetch} />
      )}
      {/* 댓글 리스트 섹션 */}
      {/* <FeatureReply
                  avatarLogo={reply.author === '트루포인트 관리자' ? undefined : ''}
                  key={reply.author + reply.createdAt}
                  author={reply.author}
                  content={reply.content}
                  createdAt={reply.createdAt}
                  replyId={reply.replyId}
                  refetch={refetch}
                /> */}
      {currentSuggestion.replies
      && currentSuggestion.replies.length > 0
      && (
        <div style={{ marginTop: 16 }}>
            {currentSuggestion.replies
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((reply) => (
                <FeatureReply
                  avatarLogo={reply.author === '트루포인트 관리자' ? undefined : ''}
                  key={reply.author + reply.createdAt}
                  author={reply.author}
                  content={reply.content}
                  createdAt={reply.createdAt}
                  replyId={reply.replyId}
                  refetch={refetch}
                />
              ))}
        </div>
      )}

      {/* 이전글, 목록, 다음글 버튼셋 */}
      <div id="button-set" className={classes.buttonSet}>
        <Button
          style={{ width: '30%' }}
          size="large"
          disabled={currentSuggestionIndex === 0}
          variant="outlined"
          onClick={() => {
            onOtherFeatureClick(previousFeature.suggestionId);
          }}
        >
          <KeyboardArrowLeft />
          {currentSuggestionIndex !== 0 && (
            <Typography>
              {previousFeature.title.length > TITLE_LENGTH
                ? `${previousFeature.title.slice(0, TITLE_LENGTH)}...`
                : previousFeature.title}
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
          disabled={currentSuggestionIndex === data.length - 1}
          variant="outlined"
          onClick={() => {
            onOtherFeatureClick(nextFeature.suggestionId);
          }}
        >
          {currentSuggestionIndex !== data.length - 1 && (
            <Typography>
              {nextFeature.title.length > TITLE_LENGTH
                ? `${nextFeature.title.slice(0, TITLE_LENGTH)}...`
                : nextFeature.title}
            </Typography>
          )}
          <KeyboardArrowRight />
        </Button>
      </div>
    </div>
  );
}
