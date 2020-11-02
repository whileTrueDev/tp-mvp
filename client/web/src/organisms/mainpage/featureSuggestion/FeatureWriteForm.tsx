import React from 'react';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import Button from '../../../atoms/Button/Button';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import ShowSnack from '../../../atoms/ShowSnack';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: theme.spacing(8),
    justifyContent: 'center',
    alighItems: 'center',
  },

  form: {
    width: '70%',
  },
  title: {
    margin: theme.spacing(3),
  },
  titleInput: {
    width: '400px',
  },
  contents: {
    margin: theme.spacing(2),
  },
}));
interface FeatureSuggestion {
  title: string;
  category: string | number;
  contents: string;
  userId: string;
  image: any;
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
  const { editData } = props;
  const { enqueueSnackbar } = useSnackbar();
  const authContext = useAuthContext();
  const [state, setState] = React.useState<FeatureSuggestion>({
    title: '',
    category: '0',
    contents: '',
    userId: authContext.user.userId,
    image: null,
  });
  const history = useHistory();
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
  const [, editPostRequest] = useAxios(
    { url: '/feature/upload-edit', method: 'patch' }, { manual: true },
  );
  const handleSubmit = () => {
    if (editData) {
      editPostRequest({ data: [state, editData.id] }).then(() => {
        ShowSnack('수정 되었습니다', 'info', enqueueSnackbar);
        window.location.replace('/feature-suggestion');
      });
    } else {
      postRequest({ data: state }).then(() => {
        ShowSnack('등록 되었습니다.', 'success', enqueueSnackbar);
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
    if (editData) {
      setState({
        ...state,
        title: editData.title,
        category: editData.category,
        contents: editData.content,
      });
    }
  }, [editData, setState, state]);
  return (
    <div className={classes.root}>
      <Typography className={classes.contents} variant="h4">글쓰기</Typography>
      <div className={classes.contents}>
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
      <div className={classes.contents}>
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
            <option value="1">편집점 관련</option>
            <option value="2">기타</option>
          </Select>
        </FormControl>
      </div>
      <div className={classes.contents}>
        <TextField
          className={classes.form}
          id="feature-contents"
          multiline
          // defaultValue={state.contents}
          value={state.contents}
          onChange={handleContents}
          rows={20}
          placeholder="내용을 입력해주세요."
          variant="outlined"
        />
      </div>
      <div>
        {/* <Button className={classes.contents}> */}
        <input type="file" name="file" ref={imageObject} onChange={handleImageUpload} />
        {/* </Button> */}
      </div>
      <div>
        <Button
          className={classes.contents}
          onClick={handleCancelButton}
        >
          취소
        </Button>
        <Button
          className={classes.contents}
          onClick={handleSubmit}
        >
          등록하기
        </Button>
      </div>
    </div>
  );
}
