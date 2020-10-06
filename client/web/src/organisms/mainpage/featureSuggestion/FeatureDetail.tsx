import React from 'react';
import Markdown from 'react-markdown/with-html';
import useAxios from 'axios-hooks';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button, ButtonGroup, Paper, Typography
} from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import Divider from '@material-ui/core/Divider';
import Card from '../../../atoms/Card/Card';
import { FeatureData } from '../../../interfaces/Feature';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import FeatureWriteForm from './FeatureWriteForm';

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
  replyCard: {
    padding: theme.spacing(2),
    width: '50%',
    display: 'column',
    justifyContent: 'space-between',
    borderBottom: '1px solid #ddd',
  },
  replyTextCard: {
    backgroundColor: theme.palette.grey[400],
    padding: theme.spacing(2),
  }
}));

export interface FeatureDetailProps {
  data: FeatureData[];
  selectedSuggestionId: string;
  onBackClick: () => void;
  onOtherFeatureClick: (num: number) => void;
}
export default function FeatureDetail({
  data, onBackClick, selectedSuggestionId,
  onOtherFeatureClick
}: FeatureDetailProps): JSX.Element {
  const classes = useStyles();
  const authContext = useAuthContext();
  const [editState, setEditState] = React.useState(false);
  const [, deleteRequest] = useAxios(
    { url: '/feature/upload-delete', method: 'delete' }, { manual: true }
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
  const handleEditButton = () => {
    setEditState(true);
  };
  const doDelete = () => {
    const doConfirm = window.confirm('삭제 하시겠습니까?');
    if (doConfirm) {
      deleteRequest({ params: { data: currentSuggestion?.id } });
    }
  };
  return (
    <div>
      {!editState ? (
        <div>
          <Paper component="article">
            <div className={classes.title}>
              <Typography variant="h6" className={classes.titleText}>
                {currentSuggestion?.title}
              </Typography>
              <Typography color="textSecondary">
                {`${currentSuggestion?.category} • ${new Date(currentSuggestion!.createdAt).toLocaleString()}`}
              </Typography>
            </div>

            <div className={classes.contentsText}>
              <Markdown
                className={classes.markdown}
                source={currentSuggestion?.content}
                escapeHtml={false}
                renderers={{ code: ({ value }) => <Markdown source={value} /> }}
              />
            </div>
            {currentSuggestion?.reply ? (
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
            ) : null}
          </Paper>

          <div id="button-set" className={classes.buttonSet}>
            <Button
              style={{ width: '25%' }}
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
              onClick={() => { onBackClick(); }}
            >
              목록으로
            </Button>
            <Button
              style={{ width: '25%' }}
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
          {currentSuggestion?.author === authContext.user.userId
            ? (
              <ButtonGroup disableElevation variant="contained" color="primary">
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={handleEditButton}
                >
                  수정
                </Button>
                <Button
                  size="large"
                  variant="contained"
                  color="secondary"
                  onClick={doDelete}
                >
                  삭제
                </Button>
              </ButtonGroup>
            ) : null}
        </div>
      )
        : (
          <FeatureWriteForm
            editData={currentSuggestion}
          />
        )}
    </div>
  );
}
