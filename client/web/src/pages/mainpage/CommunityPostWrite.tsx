import React, {
  useCallback, useEffect, useMemo,
} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Container, Button,
} from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import SunEditor from 'suneditor/src/lib/core';
// dto
import { CreateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/createCommunityPost.dto';
import { UpdateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/updateCommunityPost.dto';
// snackbar
import { useSnackbar } from 'notistack';
import ShowSnack from '../../atoms/snackbar/ShowSnack';
// 컴포넌트
import CommunityBoardCommonLayout from '../../organisms/mainpage/communityBoard/share/CommunityBoardCommonLayout';
import NicknamePasswordInput from '../../organisms/mainpage/communityBoard/write/NicknamePasswordInput';
import BoardTitle from '../../organisms/mainpage/communityBoard/share/BoardTitle';
import InputField from '../../organisms/mainpage/communityBoard/write/InputField';
// 훅
import useScrollTop from '../../utils/hooks/useScrollTop';
import usePostState from '../../utils/hooks/usePostWriteState';
import useSunEditor from '../../utils/hooks/useSunEditor';
import usePostWriteEditAPI from '../../utils/hooks/usePostWriteEditAPI';

const useStyles = makeStyles((theme: Theme) => createStyles({
  title: {
    padding: theme.spacing(6, 0),
    display: 'flex',
  },
  logoImage: {
    width: '100%',
    maxWidth: '40px',
    maxHeight: '40px',
    marginRight: theme.spacing(2),
  },
  buttonContainer: {
    textAlign: 'end',
    '&>*': {
      margin: theme.spacing(1),
    },
    '&>:last-child': {
      marginRight: 0,
    },
  },
  editorContainer: {
    marginBottom: theme.spacing(2),
  },
}));

// editor 내용 가져오는 함수
const getHtmlFromEditor = (editor: React.MutableRefObject<SunEditor | null>) => {
  if (editor.current) {
    return editor.current.core.getContents(false);
  }
  console.error('editor.current not exist');
  throw new Error('문제가 발생했습니다. 새로고침 후 다시 시도해 주세요');
};

// 입력된 문자열에서 띄어쓰기,탭,공백 제외한 값 반환
const trimmedContent = (content: string): string => (
  content.replace(/(<\/?[^>]+(>|$)|&nbsp;|\s)/g, ''));

// 에러메시지
const ErrorMessages = {
  title: '제목을 입력해주세요',
  nickname: '닉네임을 입력해주세요',
  password: '비밀번호를 입력해주세요',
  content: '내용을 입력해주세요',
};

/**
 * 글생성/ 수정 페이지 컴포넌트
 * 
 * 컴포넌트함수 시작 시 
 * params로 넘어온 postId값이 있으면 수정페이지를 보여주고, 
 * 없으면 새 글 작성페이지를 보여준다
 * 
 * 글 작성버튼 -> handleSubmit 함수 실행
 * 글 수정버튼 -> handleEdit 함수 실행
 */
export default function CommunityPostWrite(): JSX.Element {
  const classes = useStyles();
  const {
    titleValue, onTitleChange, setTitle,
    passwordValue, onPasswordChange,
    nicknameValue, onNicknameChange,
  } = usePostState(); // 닉네임, 비밀번호, 제목 인풋 상태
  const { postId, platform } = useParams<any>();
  const history = useHistory();
  const { editorRef: editor, EditorContainer } = useSunEditor();
  const { handleCreatePost, handleEditPost, handleLoadPost } = usePostWriteEditAPI(postId);
  const { enqueueSnackbar } = useSnackbar();

  // postId의 여부로 글생성/글수정 모드 확인
  const isEditMode = useMemo(() => !!postId, [postId]);

  useScrollTop();

  useEffect(() => {
    if (isEditMode) {
      // 글 수정하는 경우 글 내용과 제목 가져와서 보여줌
      handleLoadPost((res: { data: { content: any; title: any; }; }) => {
        const { content, title } = res.data;
        setTitle(title);
        if (editor.current) {
          editor.current.setContents(content);
        }
      });
    }
  // 컴포넌트 마운트 시 한번만 실행되는 effect
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // console.log('글 생성');
    const createPostDto: CreateCommunityPostDto = {
      title: titleValue,
      content: '',
      nickname: nicknameValue,
      password: passwordValue,
      platform,
      category: 0, // 일반글=0, 공지글=1
    };

    try {
      createPostDto.content = getHtmlFromEditor(editor);

      // ['nickname', 'password', 'title', 'content'] 
      // 중 빈 값 === '' 이 있는지 확인후 없으면 에러 스낵바
      const keys = ['nickname', 'password', 'title', 'content'] as Array<keyof CreateCommunityPostDto & keyof typeof ErrorMessages>;

      keys.forEach((key: keyof CreateCommunityPostDto & keyof typeof ErrorMessages) => {
        const value = (key === 'content')
          ? trimmedContent(createPostDto[key])
          : createPostDto[key].trim();

        if (value === '') throw new Error(ErrorMessages[key]);
      });
    } catch (err) {
      ShowSnack(err.message, 'error', enqueueSnackbar);
      return;
    }

    // createPostDto로 글 생성 요청
    handleCreatePost(createPostDto);
  }, [titleValue, nicknameValue, passwordValue, platform, handleCreatePost, editor, enqueueSnackbar]);

  const handleEdit = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // console.log('글 수정');

    const updatePostDto: UpdateCommunityPostDto = {
      title: titleValue,
      content: '',
    };

    try {
      updatePostDto.content = getHtmlFromEditor(editor);

      // ['title', 'content'] 중 빈 값'' 이 있는지 확인
      const keys = ['title', 'content'] as Array<keyof UpdateCommunityPostDto & keyof typeof ErrorMessages>;

      keys.forEach((key: keyof UpdateCommunityPostDto & keyof typeof ErrorMessages) => {
        const value = (key === 'content')
          ? trimmedContent(updatePostDto[key])
          : updatePostDto[key].trim();

        if (value === '') throw new Error(ErrorMessages[key]);
      });
    } catch (err) {
      ShowSnack(err.message, 'error', enqueueSnackbar);
      return;
    }

    // updatePostDto로 글 수정 요청
    handleEditPost(updatePostDto);
  }, [titleValue, handleEditPost, editor, enqueueSnackbar]);

  return (
    <CommunityBoardCommonLayout>
      <Container maxWidth="md">

        <BoardTitle platform={platform} />

        <form className="form">
          {isEditMode
            ? null
            : (
              <NicknamePasswordInput
                nicknameValue={nicknameValue}
                passwordValue={passwordValue}
                onPasswordChange={onPasswordChange}
                onNicknameChange={onNicknameChange}
              />
            )}

          <InputField
            name="title"
            label="제목"
            maxLength={20}
            helperText="* 제목은 최대 20글자까지 가능합니다"
            placeholder="제목을 입력하세요"
            value={titleValue}
            onChange={onTitleChange}
          />
          <EditorContainer
            className={classes.editorContainer}
          />

          <div className={classes.buttonContainer}>
            <Button
              variant="contained"
              size="large"
              onClick={history.goBack}
            >
              취소
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={isEditMode ? handleEdit : handleSubmit}
            >
              {isEditMode ? '수정' : '등록'}
            </Button>
          </div>
        </form>

      </Container>
    </CommunityBoardCommonLayout>
  );
}
