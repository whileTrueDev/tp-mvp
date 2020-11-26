import React from 'react';
import classnames from 'classnames';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Checkbox, FormControlLabel } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';

// import { FeatureSuggestionPostDto } from '@truepoint/shared/dist/dto/featureSuggestion/featureSuggestionPost.dto';
import { FeatureSuggestionPatchDto } from '@truepoint/shared/dist/dto/featureSuggestion/featureSuggestionPatch.dto';
import { FeatureSuggestion } from '@truepoint/shared/dist/interfaces/FeatureSuggestion.interface';
import Button from '../../../atoms/Button/Button';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import ToastUiEditor from './ToastUiEditor';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    justifyContent: 'center',
    alighItems: 'center',
  },
  flex: { display: 'flex', alignItems: 'center' },
  title: { marginTop: theme.spacing(3) },
  titleInput: { width: '400px' },
  button: { marginRight: theme.spacing(1) },
  contents: { marginTop: theme.spacing(2) },
  writeForm: { marginTop: theme.spacing(8) },
  buttonSet: { textAlign: 'right' },
}));

export default function FeatureWriteForm(): JSX.Element {
  const classes = useStyles();
  const authContext = useAuthContext();
  const history = useHistory();
  const param = useParams<{id: string} | undefined>();
  const location = useLocation<FeatureSuggestion[]>();
  const { enqueueSnackbar } = useSnackbar();

  // ******************************************************
  // 기능제안 state
  const [featureLock, setFeatureLock] = React.useState<boolean>(false);
  const [featureSource, setFeatureSource] = React.useState<Pick<FeatureSuggestion, 'title' | 'category' | 'content'>>({
    title: '',
    category: '홈페이지 개선',
    content: '',
  });
  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeatureSource({ ...featureSource, title: event.target.value });
  };

  const handleCategory = (event: any) => {
    setFeatureSource({ ...featureSource, category: event.target.value });
  };

  const handleContents = (str: string) => {
    setFeatureSource({ ...featureSource, content: str });
  };

  const handleLockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeatureLock(event.target.checked);
  };

  // ******************************************************
  // 기능제안 등록
  const [, postRequest] = useAxios(
    { url: '/feature-suggestion', method: 'post' }, { manual: true },
  );
  function handlePostSubmit() {
    const data: any = {
      ...featureSource,
      userId: authContext.user.userId,
      author: authContext.user.userId,
      isLock: featureLock, // 비밀글 여부
    };
    postRequest({ data })
      .then(() => ShowSnack('기능제안이 등록 되었습니다.', 'success', enqueueSnackbar))
      .then(() => history.push('/feature-suggestion'))
      .catch((err) => ShowSnack('기능제안 등록 중 오류가 발생했습니다. 문의 바랍니다.', 'error', enqueueSnackbar));
  }

  // ******************************************************
  // 기존 기능제안 수정
  const [, editPatchRequest] = useAxios(
    { url: '/feature-suggestion', method: 'patch' }, { manual: true },
  );
  function handlePatchSubmit(targetSuggestionId: string | number) {
    const data: FeatureSuggestionPatchDto = {
      ...featureSource,
      suggestionId: Number(targetSuggestionId),
      userId: authContext.user.userId,
      author: authContext.user.userId,
      isLock: featureLock, // 비밀글 여부 비밀글인 경우 true.
    };
    editPatchRequest({ data })
      .then((res) => {
        if (res.data) {
          ShowSnack('기능제안이 수정 되었습니다.', 'success', enqueueSnackbar);
          history.push('/feature-suggestion');
        }
      })
      .catch(() => ShowSnack('기능제안 수정 중 오류가 발생했습니다. 문의 바랍니다.', 'error', enqueueSnackbar));
  }

  // 취소 버튼 클릭 핸들러
  const handleCancelButton = () => {
    history.push('/feature-suggestion');
  };

  React.useEffect(() => {
    if (param && param.id) {
      setFeatureSource({
        ...featureSource,
        title: location.state[0].title,
        category: location.state[0].category,
        content: location.state[0].content,
      });
    }
  // 한번만 실행되어야 함.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={classes.root}>
      <Typography className={classnames(classes.contents, classes.writeForm)} variant="h4">글쓰기</Typography>
      {/* 분류 선택 */}
      <div className={classnames(classes.contents, classes.flex)}>
        <Typography style={{ marginRight: 16 }} variant="h6">분류</Typography>
        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-age-native-simple">카테고리</InputLabel>
          <Select
            native
            id="feature-category"
            label="카테고리"
            value={featureSource.category}
            onChange={handleCategory}
            inputProps={{
              name: '카테고리',
              id: 'outlined-age-native-simple',
            }}
          >
            <option value="홈페이지 개선">홈페이지 개선</option>
            <option value="하이라이트 관련">하이라이트 관련</option>
            <option value="지속적으로 추가">지속적으로 추가</option>
            <option value="기타">기타</option>
          </Select>
        </FormControl>
      </div>
      {/* 제목 작성 */}
      <div className={classnames(classes.contents, classes.flex)}>
        <Typography style={{ marginRight: 16 }} variant="h6">제목</Typography>
        <TextField
          className={classes.titleInput}
          id="feature-title"
          value={featureSource.title}
          rowsMax={1}
          variant="outlined"
          placeholder="제목을 입력해주세요."
          onChange={handleTitle}
        />
      </div>
      {/* 기능 제안 내용 입력 */}
      <div className={classes.contents}>
        <ToastUiEditor
          state={!!(param && param.id)}
          previousContents={featureSource.content}
          handleContents={handleContents}
        />
      </div>
      <div className={classes.buttonSet}>
        <FormControlLabel
          label="비밀글"
          control={(
            <Checkbox
              checked={featureLock}
              onChange={handleLockChange}
              color="primary"
            />
            )}
          style={{
            verticalAlign: 'bottom',
            display: 'inline-flex',
          }}
        />
        <Button
          color="default"
          className={classnames(classes.contents, classes.button)}
          onClick={handleCancelButton}
        >
          취소
        </Button>
        <Button
          className={classnames(classes.contents, classes.button)}
          onClick={() => {
            // 글수정의 경우
            if (param && param.id) handlePatchSubmit(param.id);
            // 글 첫 게시
            else handlePostSubmit();
          }}
        >
          {param && param.id ? '수정하기' : '등록하기'}
        </Button>
      </div>
    </div>
  );
}
