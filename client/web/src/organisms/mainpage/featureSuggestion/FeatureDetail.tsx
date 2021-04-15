import {
  Button, CircularProgress, Paper, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Create, Delete, KeyboardArrowLeft, KeyboardArrowRight,
} from '@material-ui/icons';
import LockIcon from '@material-ui/icons/Lock';
import { Viewer } from '@toast-ui/react-editor';
import { FeatureSuggestion } from '@truepoint/shared/dist/interfaces/FeatureSuggestion.interface';
import useAxios from 'axios-hooks';
import classnames from 'classnames';
import { useSnackbar } from 'notistack';
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import { FeatureProgressChip } from '../../../atoms/Chip/FeatureProgressChip';
import CustomDialog from '../../../atoms/Dialog/Dialog';
// attoms snackbar
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import dateExpression from '../../../utils/dateExpression';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import CheckPasswordForm from '../shared/CheckPasswordForm';
import FeatureReply from './sub/FeatureReply';
import FeatureReplyInput from './sub/FeatureReplyInput';

const useStyles = makeStyles((theme) => ({
  markdown: { fontSize: theme.typography.body1.fontSize },
  title: {
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(0, 0, 0, 0.23)',
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  },
  titleText: { textTransform: 'none', fontWeight: 'bold' },
  contentsText: { padding: theme.spacing(4), minHeight: 300, backgroundColor: theme.palette.common.white },
  loadingWrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
  secretText: {
    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 300,
  },
  buttonSet: {
    padding: `${theme.spacing(4)}px 0px ${theme.spacing(2)}px`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editDeleteButtonSet: {
    backgroundColor: theme.palette.common.white,
    padding: theme.spacing(1),
    textAlign: 'right',
  },
  editDeleteButton: {
    borderRadius: 0,
    color: theme.palette.common.black,
    borderColor: 'rgba(0, 0, 0, 0.23)',
  },
  lockIcon: {
    verticalAlign: 'middle',
    display: 'inline-flex',
    marginLeft: '8px',
  },
  pageButton: { width: '300px' },
  listButton: { width: '100px' },
  editor: { color: theme.palette.text.primary },
}));

export interface FeatureDetailProps {
  data: Omit<FeatureSuggestion, 'content' | 'replies'>[];
  selectedSuggestionId: string;
  onBackClick: () => void;
  onOtherFeatureClick: (num: number) => void;
  featureListRefetch: () => void;
}
export default function FeatureDetail({
  data, onBackClick, selectedSuggestionId,
  onOtherFeatureClick, featureListRefetch,
}: FeatureDetailProps): JSX.Element {
  const classes = useStyles();
  const history = useHistory();
  const authContext = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  // ******************************************************************
  // 개별 세부 데이터 요청 (답변 목록 및 개별 답변 정보, 내용 정보를 포함하는 데이터 요청)
  const [{ loading, data: featureDetailData }, doGetRequest] = useAxios<FeatureSuggestion>(
    { url: '/feature-suggestion', method: 'get', params: { id: selectedSuggestionId } },
  );
  useEffect(() => {
    doGetRequest();
  }, [selectedSuggestionId, doGetRequest]);

  const [, deleteRequest] = useAxios(
    { url: '/feature-suggestion', method: 'delete' }, { manual: true },
  );
  // 비밀번호 확인 요청
  const [, checkPassword] = useAxios({
    url: `/feature-suggestion/${selectedSuggestionId}/password`, method: 'POST',
  }, { manual: true });
  // length of title to render on Next/Previous button
  const TITLE_LENGTH = 15;

  // ******************************************************************
  // (내용/답변목록을 제외한) 기능제안 목록 중, 현재 기능제안 인덱스와 해당 데이터
  const currentIndex = data.findIndex((d) => d.suggestionId === Number(selectedSuggestionId));
  const currentFeatureData = data[currentIndex];

  // Previous Feature
  const previousFeature = data[currentIndex - 1];

  // Next Feature
  const nextFeature = data[currentIndex + 1];

  const [dialogState, setDialogState] = useState<{open: boolean, context: 'edit'|'delete'}>({ open: false, context: 'edit' });
  const handleCheckDialogClose = () => setDialogState((prev) => ({ ...prev, open: false }));
  // 글 수정버튼 눌렀을 때 다이얼로그 상태 변경
  const handleCheckDialogOpenEdit = useCallback(() => {
    setDialogState({ open: true, context: 'edit' });
  }, []);
  // 글 삭제버튼 눌렀을 때 다이얼로그 상태 변경
  const handleCheckDialogOpenDelete = useCallback(() => {
    setDialogState({ open: true, context: 'delete' });
  }, []);

  // ******************************************************************
  // 수정 페이지로 이동
  const moveToEditPage = useCallback(() => {
    history.push(`/feature-suggestion/write/${currentFeatureData.suggestionId}`,
      { featureDetailData, isEdit: true });
  }, [currentFeatureData.suggestionId, featureDetailData, history]);

  // ******************************************************************
  // 삭제
  const handleDelete = useCallback(() => {
    deleteRequest({ data: { id: selectedSuggestionId } })
      .then(() => {
        handleCheckDialogClose();
        ShowSnack('올바르게 삭제되었습니다.', 'success', enqueueSnackbar);
        featureListRefetch();
        history.push('/feature-suggestion');
      })
      .catch(() => {
        ShowSnack('삭제 도중 오류가 발생했습니다. 잠시후 다시 시도해주세요.', 'error', enqueueSnackbar);
      });
  }, [deleteRequest, enqueueSnackbar, featureListRefetch, history, selectedSuggestionId]);

  const dialogSubmitFunction = useMemo(() => (
    dialogState.context === 'edit'
      ? moveToEditPage
      : handleDelete
  ), [dialogState.context, handleDelete, moveToEditPage]);

  if (!currentFeatureData) {
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
      <Paper component="article">
        {/* 제목 섹션 */}
        <div className={classes.title}>
          <div>
            <Typography component="div" variant="h6" className={classes.titleText}>
              {currentFeatureData.title}
              {' '}
              {FeatureProgressChip(currentFeatureData.state)}
              {currentFeatureData.isLock && (
              <LockIcon
                color="primary"
                className={classes.lockIcon}
                fontSize="small"
              />
              )}
            </Typography>
            <Typography variant="body1" color="textSecondary" style={{ color: '#0000008a' }}>
              {currentFeatureData.author?.userId && (
                <span>
                  {currentFeatureData.userIp}
                </span>
              )}
            </Typography>
          </div>
          <Typography color="textSecondary" component="div" style={{ color: '#0000008a' }}>
            <Typography>
              {currentFeatureData.category}
            </Typography>
            <Typography>
              {dateExpression({
                compoName: 'selected-view',
                createdAt: currentFeatureData.createdAt,
              })}
            </Typography>
          </Typography>
        </div>
        <div className={classes.editDeleteButtonSet}>
          <Button
            className={classes.editDeleteButton}
            variant="outlined"
            onClick={handleCheckDialogOpenEdit}
          >
            <Create />
            수정
          </Button>
          <Button
            className={classes.editDeleteButton}
            variant="outlined"
            onClick={handleCheckDialogOpenDelete}
          >
            <Delete />
            삭제
          </Button>
        </div>

        {/* 글수정, 삭제시 비밀번호 확인 다이얼로그 */}
        <CustomDialog
          open={dialogState.open}
          onClose={handleCheckDialogClose}
        >
          <CheckPasswordForm
            closeDialog={handleCheckDialogClose}
            checkPassword={checkPassword}
            successHandler={dialogSubmitFunction}
          >
            {dialogState.context === 'delete' ? <Typography>게시글 삭제시 복구가 불가능합니다</Typography> : undefined}
          </CheckPasswordForm>
        </CustomDialog>

        {/* 내용 섹션 */}
        {loading && (
          <div className={classnames(classes.contentsText, classes.loadingWrapper)}>
            <CircularProgress />
          </div>
        )}
        {!loading && featureDetailData && (
          <div className={classes.contentsText}>
            <Viewer initialValue={featureDetailData.content} />
          </div>
        )}
      </Paper>

      {/* 댓글 작성하기 */}
      {currentFeatureData.author?.userId === authContext.user.userId && (
        <FeatureReplyInput
          currentSuggestion={currentFeatureData}
          refetch={featureListRefetch}
          avatarLogo={currentFeatureData.author?.profileImage || ''}
        />
      )}
      {!loading && featureDetailData && (
      <div style={{ marginTop: 16 }}>
        {featureDetailData.replies && featureDetailData.replies
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((reply) => (
            <FeatureReply
              avatarLogo={reply.author?.profileImage}
              key={reply.author?.userId + reply.createdAt}
              author={reply.author?.userId}
              content={reply.content}
              createdAt={reply.createdAt}
              replyId={reply.replyId}
              refetch={featureListRefetch}
            />
          ))}
      </div>
      )}
      {/* 이전글, 목록, 다음글 버튼셋 */}
      <div id="button-set" className={classes.buttonSet}>
        <Button
          className={classes.pageButton}
          size="large"
          disabled={currentIndex === 0}
          variant="outlined"
          onClick={() => {
            if (previousFeature.isLock) {
              if (previousFeature.author?.userId === authContext.user.userId) {
                onOtherFeatureClick(previousFeature.suggestionId);
              } else ShowSnack('비밀글은 작성자만 볼 수 있습니다.', 'error', enqueueSnackbar);
            } else {
              onOtherFeatureClick(previousFeature.suggestionId);
            }
          }}
        >
          <KeyboardArrowLeft />
          {currentIndex !== 0 && (
          <Typography>
            {previousFeature.title.length > TITLE_LENGTH
              ? `${previousFeature.title.slice(0, TITLE_LENGTH)}...`
              : previousFeature.title}
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
          disabled={currentIndex === data.length - 1}
          variant="outlined"
          onClick={() => {
            if (nextFeature.isLock) {
              if (nextFeature.author?.userId === authContext.user.userId) {
                onOtherFeatureClick(nextFeature.suggestionId);
              } else ShowSnack('비밀글은 작성자만 볼 수 있습니다.', 'error', enqueueSnackbar);
            } else {
              onOtherFeatureClick(nextFeature.suggestionId);
            }
          }}
        >
          {currentIndex !== data.length - 1 && (
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
