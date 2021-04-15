import {
  Backdrop, Checkbox, CircularProgress, FormControlLabel, Typography,
} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { FeatureSuggestionPatchDto } from '@truepoint/shared/dist/dto/featureSuggestion/featureSuggestionPatch.dto';
import { FeatureSuggestionPostDto } from '@truepoint/shared/dist/dto/featureSuggestion/featureSuggestionPost.dto';
import { FeatureSuggestion } from '@truepoint/shared/dist/interfaces/FeatureSuggestion.interface';
import useAxios from 'axios-hooks';
import classnames from 'classnames';
import { useSnackbar } from 'notistack';
import React, { useRef } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import Button from '../../../atoms/Button/Button';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import useToggle from '../../../utils/hooks/useToggle';

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
  editor: { color: theme.palette.common.white },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export const FEATURE_SUGGESTION_OPTIONS = [
  { id: 0, value: '사이트 관련' },
  { id: 1, value: '인방랭킹' },
  { id: 2, value: '유튜브 편집점' },
  { id: 3, value: '기타' },
];

export default function FeatureWriteForm(): JSX.Element {
  const classes = useStyles();
  const authContext = useAuthContext();
  const history = useHistory();
  const param = useParams<{id: string} | undefined>();
  const location = useLocation<{featureDetailData: FeatureSuggestion; isEdit: boolean;}>();
  const { enqueueSnackbar } = useSnackbar();

  // ******************************************************
  // 기능제안 state
  const editorRef = useRef<Editor>(null);
  type FeatureSource = Pick<FeatureSuggestion, 'password' | 'title' | 'category'>;
  const [featureSource, setFeatureSource] = React.useState<FeatureSource>({
    title: '',
    password: '',
    category: FEATURE_SUGGESTION_OPTIONS[0].value,
  });
  const handleChange = (
    key: keyof FeatureSource,
  ) => (e: React.ChangeEvent<any>) => {
    setFeatureSource({ ...featureSource, [key]: e.target.value });
  };
  const featureLock = useToggle();

  // ******************************************************
  // 기능제안 등록
  const [{ loading: postLoading }, postRequest] = useAxios(
    { url: '/feature-suggestion', method: 'post' }, { manual: true },
  );

  function handlePostSubmit() {
    if (editorRef.current
      && editorRef.current.getInstance().getHtml() && featureSource.title) {
      const contents = editorRef.current.getInstance().getHtml();
      const data: FeatureSuggestionPostDto = {
        ...featureSource,
        userId: authContext.user.userId,
        author: authContext.user.userId,
        isLock: featureLock.toggle, // 비밀글 여부
        content: contents,
      };

      postRequest({ data })
        .then(() => ShowSnack('기능제안이 등록 되었습니다.', 'success', enqueueSnackbar))
        .then(() => history.push('/feature-suggestion'))
        .catch((err) => ShowSnack('기능제안 등록 중 오류가 발생했습니다. 문의 바랍니다.', 'error', enqueueSnackbar));
    } else if (!featureSource.title) {
      ShowSnack('제목을 입력해주세요!!', 'warning', enqueueSnackbar);
    } else if (!(editorRef.current && editorRef.current.getInstance().getHtml())) {
      ShowSnack('내용을 입력해주세요!!', 'warning', enqueueSnackbar);
    } else if (featureLock.toggle && !featureSource.password) {
      ShowSnack('게시글 비밀번호를 입력해주세요!!', 'warning', enqueueSnackbar);
    }
  }

  // ******************************************************
  // 기존 기능제안 수정
  const [{ loading: patchLoading }, editPatchRequest] = useAxios(
    { url: '/feature-suggestion', method: 'patch' }, { manual: true },
  );

  function handlePatchSubmit(targetSuggestionId: string | number) {
    if (editorRef.current && editorRef.current.getInstance().getHtml() && featureSource.title) {
      const contents = editorRef.current.getInstance().getHtml();
      const data: FeatureSuggestionPatchDto = {
        title: featureSource.title,
        category: featureSource.category,
        suggestionId: Number(targetSuggestionId),
        userId: authContext.user.userId,
        author: authContext.user.userId,
        isLock: featureLock.toggle, // 비밀글 여부 비밀글인 경우 true.
        content: contents,
      };

      editPatchRequest({ data })
        .then((res) => {
          if (res.data) {
            ShowSnack('기능제안이 수정 되었습니다.', 'success', enqueueSnackbar);
            history.push(`/feature-suggestion/read/${targetSuggestionId}`);
          }
        })
        .catch(() => ShowSnack('기능제안 수정 중 오류가 발생했습니다. 문의 바랍니다.', 'error', enqueueSnackbar));
    } else if (!(editorRef.current && editorRef.current.getInstance().getHtml())) {
      ShowSnack('내용을 입력해주세요!!', 'warning', enqueueSnackbar);
    } else {
      ShowSnack('제목을 입력해주세요!!', 'warning', enqueueSnackbar);
    }
  }

  // 취소 버튼 클릭 핸들러
  const handleCancelButton = () => {
    history.goBack();
  };

  React.useEffect(() => {
    if (param && param.id) { // 글 수정하기 작업시
      // 비밀글 여부를 기존 글의 비밀글 여부로 변경
      featureLock.setToggle(location.state ? !!location.state.featureDetailData.isLock : false);
      // 글 제목, 카테고리를 기존 글의 그것으로 변경
      setFeatureSource({
        ...featureSource,
        title: location.state?.featureDetailData?.title,
        category: location.state?.featureDetailData?.category,
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
        <Typography style={{ marginRight: 16 }} variant="h6">분류*</Typography>
        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-age-native-simple">카테고리</InputLabel>
          <Select
            native
            id="feature-category"
            label="카테고리"
            value={featureSource.category}
            onChange={handleChange('category')}
            inputProps={{
              name: '카테고리',
              id: 'outlined-age-native-simple',
            }}
          >
            {FEATURE_SUGGESTION_OPTIONS.map((option) => (
              <option key={option.id} value={option.value}>{option.value}</option>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* 제목 작성 */}
      <div className={classnames(classes.contents, classes.flex)}>
        <Typography style={{ marginRight: 16 }} variant="h6">제목*</Typography>
        <TextField
          className={classes.titleInput}
          id="feature-title"
          inputProps={{ maxLength: 50 }}
          value={featureSource.title}
          rowsMax={1}
          variant="outlined"
          placeholder="제목을 입력해주세요."
          onChange={handleChange('title')}
        />
      </div>

      {/* 기능 제안 내용 입력 */}
      <div className={classes.contents}>

        <Editor
          previewStyle="vertical"
          height="500px"
          initialEditType="wysiwyg"
          initialValue={location.state ? location.state.featureDetailData?.content : ''}
          ref={editorRef}
        />
        <Backdrop className={classes.backdrop} open={postLoading || patchLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>

      {/* 패스워드 작성 */}
      {location.state?.isEdit ? (null) : (
        <div className={classnames(classes.contents, classes.buttonSet)}>
          <FormControlLabel
            label="비밀글"
            control={(
              <Checkbox
                checked={featureLock.toggle}
                onChange={featureLock.handleToggle}
                color="primary"
              />
            )}
            style={{
              verticalAlign: 'bottom',
              display: 'inline-flex',
            }}
          />
          {featureLock.toggle && (
          <TextField
            id="feature-password"
            inputProps={{ maxLength: 4 }}
            value={featureSource.password}
            variant="outlined"
            type="password"
            name="password"
            margin="dense"
            placeholder="최대 4글자"
            label="게시글비밀번호*"
            onChange={handleChange('password')}
          />
          )}
        </div>
      )}

      <div className={classes.buttonSet}>
        <Button
          color="default"
          className={classnames(classes.contents, classes.button)}
          onClick={handleCancelButton}
        >
          취소
        </Button>
        <Button
          className={classnames(classes.contents, classes.button)}
          disabled={postLoading || patchLoading}
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
