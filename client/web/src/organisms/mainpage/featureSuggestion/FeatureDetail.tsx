import React, { useEffect, useRef } from 'react';
import Markdown from 'react-markdown/with-html';
import useAxios from 'axios-hooks';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button, Paper, Typography, Chip,
} from '@material-ui/core';
import {
  Create, Delete, KeyboardArrowLeft, KeyboardArrowRight,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import Card from '../../../atoms/Card/Card';
import { FeatureData } from '../../../interfaces/FeatureSuggestion';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import transformIdToAsterisk from '../../../utils/transformAsterisk';
// 날짜표현 컴포넌트 추가
import dateExpression from '../../../utils/dateExpression';

const useStyles = makeStyles((theme) => ({
  markdown: { fontSize: theme.typography.body1.fontSize },
  title: {
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px`,
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  idText: {
    color: theme.palette.grey[400],
  },
  titleText: { textTransform: 'none', fontWeight: 'bold' },
  contentsText: { padding: theme.spacing(4), minHeight: 300 },
  buttonSet: {
    padding: `${theme.spacing(4)}px 0px`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  replyCard: {
    padding: theme.spacing(2),
    width: '50%',
    display: 'column',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  replyTextCard: {
    backgroundColor: theme.palette.grey[400],
    padding: theme.spacing(2),
  },
  editDeleteButtonSet: {
    padding: theme.spacing(1),
    textAlign: 'right',
  },
  editDeleteButton: { borderRadius: 0 },
}));

export interface FeatureDetailProps {
  data: FeatureData[];
  selectedSuggestionId: string;
  onBackClick: () => void;
  onOtherFeatureClick: (num: number) => void;
  categoryTabSwitch: (value: number) => JSX.Element;
}
export default function FeatureDetail({
  data, onBackClick, selectedSuggestionId,
  onOtherFeatureClick, categoryTabSwitch,
}: FeatureDetailProps): JSX.Element {
  const classes = useStyles();
  const authContext = useAuthContext();

  const [, deleteRequest] = useAxios(
    { url: '/feature/upload-delete', method: 'delete' }, { manual: true },
  );
  // length of title to render on Next/Previous button
  const TITLE_LENGTH = 15;

  // Current Feature
  const currentSuggestion = data.find((d) => d.id === Number(selectedSuggestionId));
  const currentSuggestionIndex = data.findIndex((d) => d.id === Number(selectedSuggestionId));

  // Previous Feature
  const previousFeature = data[currentSuggestionIndex - 1];

  // Next Feature
  const nextFeature = data[currentSuggestionIndex + 1];

  const doDelete = () => {
    const doConfirm = window.confirm('삭제 하시겠습니까?');
    if (doConfirm) {
      deleteRequest({ params: { data: currentSuggestion?.id } });
      window.location.replace('/feature-suggestion');
    }
  };

  // 스크롤 상단으로
  const paperRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (paperRef.current) {
      window.scrollTo(0, paperRef.current.scrollHeight + 70);
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
              {currentSuggestion?.title}
              {' '}
              {currentSuggestion && progressTab(currentSuggestion?.progress)}
            </Typography>
            <Typography variant="body1" className={classes.idText}>
              {currentSuggestion?.author ? transformIdToAsterisk(currentSuggestion.author) : null}
            </Typography>
          </div>
          <Typography color="textSecondary" component="div">
            {categoryTabSwitch(Number(currentSuggestion?.category))}
            {dateExpression({
              compoName: 'selected-view',
              createdAt: currentSuggestion?.createdAt,
            })}
          </Typography>
        </div>
        {currentSuggestion?.author === authContext.user.userId
        && (
          <div className={classes.editDeleteButtonSet}>
            <Button
              className={classes.editDeleteButton}
              component={Link}
              to={{
                pathname: `/feature-suggestion/write/${currentSuggestion?.id}`,
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
          <Markdown
            className={classes.markdown}
            source={currentSuggestion?.content}
            escapeHtml={false}
                // eslint-disable-next-line react/prop-types
            renderers={{ code: ({ value }) => <Markdown source={value} /> }}
          />
        </div>
        {currentSuggestion?.reply && (
          <div className={classes.replyCard}>
            <Divider />
            <Typography variant="h6">
              관리자 답글
            </Typography>
            <Card className={classes.replyTextCard}>
              <Typography variant="body1">
                {currentSuggestion.reply}
              </Typography>
            </Card>
          </div>
        )}
      </Paper>

      <div id="button-set" className={classes.buttonSet}>
        <Button
          style={{ width: '30%' }}
          size="large"
          disabled={currentSuggestionIndex === 0}
          variant="contained"
          color="primary"
          onClick={() => {
            onOtherFeatureClick(previousFeature.id);
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
          variant="contained"
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
          variant="contained"
          color="primary"
          onClick={() => {
            onOtherFeatureClick(nextFeature.id);
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
