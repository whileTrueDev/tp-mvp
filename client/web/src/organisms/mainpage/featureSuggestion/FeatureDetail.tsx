import React, { useEffect } from 'react';
import classnames from 'classnames';
import useAxios from 'axios-hooks';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button, Paper, Typography, Chip, CircularProgress,
} from '@material-ui/core';
import {
  Create, Delete, KeyboardArrowLeft, KeyboardArrowRight,
} from '@material-ui/icons';
import { Link, useHistory } from 'react-router-dom';
import { FeatureSuggestion } from '@truepoint/shared/dist/interfaces/FeatureSuggestion.interface';
import { Viewer } from '@toast-ui/react-editor';
import LockIcon from '@material-ui/icons/Lock';
import { useSnackbar } from 'notistack';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import transformIdToAsterisk from '../../../utils/transformAsterisk';
import dateExpression from '../../../utils/dateExpression';
import FeatureReplyInput from './sub/FeatureReplyInput';
import FeatureReply from './sub/FeatureReply';
// attoms snackbar
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import CustomDialog from '../../../atoms/Dialog/Dialog';
import useDialog from '../../../utils/hooks/useDialog';

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
    padding: theme.spacing(1),
    textAlign: 'right',
  },
  editDeleteButton: { borderRadius: 0 },
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

  // // 스크롤 상단으로
  // const paperRef = useRef<HTMLDivElement>();
  // useEffect(() => {
  //   if (paperRef.current) {
  //     // window.scrollTo(0, paperRef.current.scrollHeight + 100);
  //     window.scrollTo(0, 0);
  //   }
  // });
  const confirmDialog = useDialog();
  // ******************************************************************
  // 삭제
  const handleDelete = () => {
    deleteRequest({ data: { id: selectedSuggestionId } })
      .then(() => {
        ShowSnack('올바르게 삭제되었습니다.', 'success', enqueueSnackbar);
        featureListRefetch();
        history.push('/feature-suggestion');
      })
      .catch(() => {
        ShowSnack('삭제 도중 오류가 발생했습니다. 잠시후 다시 시도해주세요.', 'error', enqueueSnackbar);
      });
  };

  // 기능제안 상태 Chip 렌더링을 위해
  const progressTab = (value: number) => {
    switch (value) {
      case 1: return (<Chip color="secondary" label="개발 확정" />);
      case 2: return (<Chip color="primary" label="개발보류" />);
      default: return (<Chip variant="outlined" label="미확인" />);
    }
  };

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
              {progressTab(currentFeatureData.state)}
              {currentFeatureData.isLock && (
              <LockIcon
                color="primary"
                className={classes.lockIcon}
                fontSize="small"
              />
              )}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {currentFeatureData.author.userId && (
                <span>
                  {authContext.user.userId === currentFeatureData.author.userId
                    ? currentFeatureData.author.userId
                    : transformIdToAsterisk(currentFeatureData.author.userId, 1.8)}
                </span>
              )}
            </Typography>
          </div>
          <Typography color="textSecondary" component="div">
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
        {currentFeatureData.author.userId === authContext.user.userId
        && (
          <div className={classes.editDeleteButtonSet}>
            <Button
              className={classes.editDeleteButton}
              component={Link}
              to={{
                pathname: `/feature-suggestion/write/${currentFeatureData.suggestionId}`,
                state: [featureDetailData],
              }}
              variant="outlined"
            >
              <Create />
              수정
            </Button>
            <Button
              className={classes.editDeleteButton}
              variant="outlined"
              onClick={confirmDialog.handleOpen}
            >
              <Delete />
              삭제
            </Button>
          </div>
        )}

        {/* 내용 섹션 */}
        {loading && (
          <div className={classnames(classes.contentsText, classes.loadingWrapper)}>
            <CircularProgress />
          </div>
        )}
        {!loading && featureDetailData && (
          <div className={classes.contentsText}>
            {/* 비밀글 + 자신이 작성한 글이 아닌 경우 비밀글 처리 */}
            {featureDetailData.isLock && featureDetailData.author.userId !== authContext.user.userId ? (
              <div className={classes.secretText}>
                <Typography>비밀글의 경우 본인만 확인할 수 있습니다.</Typography>
                <Button
                  className={classes.listButton}
                  size="large"
                  variant="outlined"
                  onClick={onBackClick}
                >
                  목록
                </Button>
              </div>
            ) : ( // 비밀글이 아닌경우 또는 비밀글 + 자신이 작성한 글인 경우 Viewer 렌더링
              <Viewer initialValue={featureDetailData.content} />
            )}
          </div>
        )}
      </Paper>

      {/* 댓글 작성하기 */}
      {currentFeatureData.author.userId === authContext.user.userId && (
        <FeatureReplyInput
          currentSuggestion={currentFeatureData}
          refetch={featureListRefetch}
          avatarLogo={currentFeatureData.author.profileImage || ''}
        />
      )}
      {!loading && featureDetailData && (
      <div style={{ marginTop: 16 }}>
        {featureDetailData.replies && featureDetailData.replies
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((reply) => (
            <FeatureReply
              avatarLogo={reply.author.profileImage}
              key={reply.author.userId + reply.createdAt}
              author={reply.author.userId}
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
              if (previousFeature.author.userId === authContext.user.userId) {
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
              if (nextFeature.author.userId === authContext.user.userId) {
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

      <CustomDialog
        fullWidth
        maxWidth="sm"
        open={confirmDialog.open}
        onClose={confirmDialog.handleClose}
        buttons
        callback={handleDelete}
      >
        <Typography>해당 기능제안을 삭제하시겠습니까?</Typography>
      </CustomDialog>
    </div>
  );
}
