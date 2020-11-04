import React from 'react';
import classnames from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import useAxios from 'axios-hooks';
import Button from '../../../atoms/Button/Button';
import useAuthContext from '../../../utils/hooks/useAuthContext';

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
interface FeatureSuggestion {
  title: string;
  category: string | number;
  contents: string;
  userId: string;
  image: any;
}

interface locationData {
  id: number;
  title: string;
  category: string | number;
  content: string;
  author: string;
  createdAt: Date;
  reply: boolean | string;
  progress: number;
}
// @hwasurr
// eslint error 정리 중 주석 처리 - 사용하지 않는 interface
// @leejineun 처리 부탁드립니다.
// interface ImageObject<T> {
//   readonly current: T | null;
// }

// @hwasurr
// eslint error 정리 중 disalbe 처리 - any 타입 정의
// @leejineun 처리 부탁드립니다.
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function FeatureWriteForm(props: any): JSX.Element {
  const authContext = useAuthContext();
  const [state, setState] = React.useState<FeatureSuggestion>({
    title: '',
    category: '0',
    contents: '',
    userId: authContext.user.userId,
    image: null,
  });
  const history = useHistory();
  const location: any = useLocation();
  const preData: locationData = location.state ? location.state[0] : null;
  const classes = useStyles();
  // const [selectedFile, setSelectedFile] = React.useState(null);
  const imageObject = React.useRef<HTMLInputElement | null>(null);
  const handleImageUpload = () => {
    if (imageObject && imageObject.current && imageObject.current.files) {
      setState({ ...state, image: imageObject.current.files[0] ? imageObject.current.src : null });
    }
  };
  // const handleImageUpload = (event: any) => {
  //   console.log(typeof event.target.src);
  // };
  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, title: event.target.value });
  };

  const handleCategory = (event: any) => {
    setState({ ...state, category: event.target.value });
  };

  const handleContents = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, contents: event.target.value });
  };

  const [, postRequest] = useAxios(
    { url: '/feature/upload', method: 'post' }, { manual: true },
  );
  const [, editPatchRequest] = useAxios(
    { url: '/feature/upload-edit', method: 'patch' }, { manual: true },
  );

  const handleSubmit = () => {
    if (preData) {
      editPatchRequest({ data: [state, preData.id] }).then(() => {
        alert('수정 되었습니다');
        window.location.replace('/feature-suggestion');
      });
    } else {
      postRequest({ data: state }).then(() => {
        alert('등록 되었습니다');
        window.location.replace('/feature-suggestion');
      });
    }
    // if (imageObject && imageObject.current) {
    // postRequest({ data: state });
    // }
  };

  const handleCancelButton = () => {
    history.push('/feature-suggestion');
  };

  React.useEffect(() => {
    if (location.state) {
      setState({
        ...state,
        title: preData.title,
        category: preData.category,
        contents: preData.content,
      });
    }
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
            defaultValue={state.category}
            value={state.category}
            onChange={handleCategory}
            inputProps={{
              name: '카테고리',
              id: 'outlined-age-native-simple',
            }}
          >
            <option value="0">홈페이지 개선</option>
            <option value="1">하이라이트 관련</option>
            <option value="2">기타</option>
          </Select>
        </FormControl>
      </div>
      {/* 제목 작성 */}
      <div className={classnames(classes.contents, classes.flex)}>
        <Typography style={{ marginRight: 16 }} variant="h6">제목</Typography>
        <TextField
          className={classes.titleInput}
          id="feature-title"
          // defaultValue={state.title}
          value={state.title}
          rowsMax={1}
          variant="outlined"
          placeholder="제목을 입력해주세요."
          onChange={handleTitle}
        />
      </div>
      {/* 기능 제안 내용 입력 */}
      <div className={classes.contents}>
        <TextField
          fullWidth
          id="feature-contents"
          multiline
          value={state.contents}
          onChange={handleContents}
          rows={12}
          placeholder="내용을 입력해주세요."
          variant="outlined"
        />
      </div>
      <div className={classes.contents}>
        <Button>
          <input type="file" name="file" ref={imageObject} onChange={handleImageUpload} />
        </Button>
      </div>
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
          onClick={handleSubmit}
        >
          등록하기
        </Button>
      </div>
    </div>
  );
}
