import React, {
  useCallback, useEffect, useMemo,
} from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
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
import TitleAndEditor from '../../organisms/mainpage/communityBoard/write/TitleAndEditor';
import NicknamePasswordInput from '../../organisms/mainpage/communityBoard/write/NicknamePasswordInput';
import BoardTitle from '../../organisms/mainpage/communityBoard/share/BoardTitle';
// 훅
import useScrollTop from '../../utils/hooks/useScrollTop';
import usePostState from '../../utils/hooks/usePostWriteState';
import useSunEditor from '../../utils/hooks/useSunEditor';
import usePostWriteEditAPI from '../../utils/hooks/usePostWriteEditAPI';
// 이미지
// import twitchLogo fro

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
interface LocationState{
  platform: 'afreeca' | 'twitch';
}

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
    initialContent, setInitialContent, titleValue, onTitleChange,
    passwordValue, onNicknameChange, nicknameValue, onPasswordChange, setTitle,
  } = usePostState();
  const { postId } = useParams<any>();
  const location = useLocation<LocationState>();
  const history = useHistory();
  const { refFn: editorRefFn, editorRef: editor } = useSunEditor();
  const { handleCreatePost, handleEditPost, handleLoadPost } = usePostWriteEditAPI(postId);
  const { enqueueSnackbar } = useSnackbar();
  // const { platform } = location.state;
  const platform = location.state ? location.state.platform : undefined;

  // postId의 여부로 글생성/글수정 모드 확인

  const isEditMode = useMemo(() => !!postId, [postId]);

  useScrollTop();

  // 글 수정을 하려면 개별글을 불러와야하고,
  // 거기서 수정 페이지로 이동할 때 platform 말고 다른 데이터도 state에 담아서 보내주면
  // 요청을 안해도 될거같다....
  useEffect(() => {
    if (isEditMode) {
      // 글 수정하는 경우 글 내용과 제목 가져와서 보여줌
      handleLoadPost((res: { data: { content: any; title: any; }; }) => {
        const { content, title } = res.data;
        setInitialContent(content);
        setTitle(title);
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
      platform: platform === 'afreeca' ? 0 : 1, // 아프리카=0, 트위치=1
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

  function goBack() {
    history.goBack();
  }

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
          <TitleAndEditor
            editorRefFn={editorRefFn}
            editor={editor.current}
            initialContent={initialContent}
            titleValue={titleValue}
            onTitleChange={onTitleChange}
          />

          <div className={classes.buttonContainer}>
            <Button
              variant="contained"
              size="large"
              onClick={goBack}
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
