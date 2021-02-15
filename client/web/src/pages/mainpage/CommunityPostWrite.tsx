import React, {
  useCallback, useEffect, useMemo,
} from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import useAxios from 'axios-hooks';
import { CreateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/createCommunityPost.dto';
import { UpdateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/updateCommunityPost.dto';
import { useSnackbar } from 'notistack';
import {
  Container, Button, Typography, Divider,
} from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import CommunityBoardCommonLayout from '../../organisms/mainpage/communityBoard/CommunityBoardCommonLayout';
import usePostState from '../../organisms/mainpage/communityBoard/usePostState';
import useSunEditor from '../../organisms/mainpage/communityBoard/useSunEditor';
import TitleAndEditor from '../../organisms/mainpage/communityBoard/sub/TitleAndEditor';
import NicknamePasswordInput from '../../organisms/mainpage/communityBoard/sub/NicknamePasswordInput';
import ShowSnack from '../../atoms/snackbar/ShowSnack';

const useStyles = makeStyles((theme: Theme) => createStyles({
  title: {
    padding: theme.spacing(6, 0),
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

// 입력된 문자열에서 띄어쓰기,탭,공백 제외한 값이 빈 문자열인지 체크
const isEmptyContent = (content: string): boolean => (
  content.replace(/(<\/?[^>]+(>|$)|&nbsp;|\s)/g, '') === '');
interface LocationState{
    platform?: string;
}

// 에러메시지
const ErrorMessages = {
  title: '제목을 입력해주세요',
  nickname: '닉네임을 입력해주세요',
  password: '비밀번호를 입력해주세요',
  content: '내용을 입력해주세요',
};
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
  const [, createPost] = useAxios({ url: '/community/posts', method: 'post' }, { manual: true });
  const [, getPostForEdit] = useAxios({ url: `/community/posts/edit/${postId}` }, { manual: true });
  const [, editPost] = useAxios({ url: `/community/posts/${postId}`, method: 'put' }, { manual: true });
  const { enqueueSnackbar } = useSnackbar();

  const { platform } = location.state;
  const isEditMode = useMemo(() => !!postId, [postId]); // postId의 여부로 글생성/글수정 모드 확인
  useEffect(() => {
    if (isEditMode) {
      // fetchPost with postId
      getPostForEdit()
        .then((res) => {
          const { content, title } = res.data;
          setInitialContent(content);
          setTitle(title);
        })
        .catch((e) => {
          console.error(e);
          if (e.response.status === 400) {
            ShowSnack('해당글이 존재하지 않습니다', 'error', enqueueSnackbar);
          } else {
            ShowSnack('글 불러오기 오류', 'error', enqueueSnackbar);
          }
        });
    }
  // 컴포넌트 마운트 시 한번만 실행되는 effect. postId가 있는 경우 데이터 가져오는 용도로
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

    if (editor.current) {
      const cont = editor.current.core.getContents(false);
      const cleanHtml = editor.current.core.cleanHTML(cont);
      createPostDto.content = cleanHtml;
    }

    // try {
    //   const keys: Array<keyof CreateCommunityPostDto & keyof typeof ErrorMessages> = ['nickname', 'password', 'title'];
    //   keys.forEach((key) => {
    //     createPostDto[key].trim();

    //   });
    // } catch (e) {

    // }

    if (createPostDto.nickname.trim() === '') {
      ShowSnack(ErrorMessages.nickname, 'error', enqueueSnackbar);
      return;
    }
    if (createPostDto.password.trim() === '') {
      ShowSnack(ErrorMessages.password, 'error', enqueueSnackbar);
      return;
    }
    if (createPostDto.title.trim() === '') {
      ShowSnack(ErrorMessages.title, 'error', enqueueSnackbar);
      return;
    }
    if (isEmptyContent(createPostDto.content)) {
      ShowSnack(ErrorMessages.content, 'error', enqueueSnackbar);
      return;
    }

    createPost({ data: createPostDto })
      .then((res) => {
        // console.log(res);
        ShowSnack('글 작성 성공', 'info', enqueueSnackbar);
        history.push('/community-board');
      })
      .catch((error) => {
        console.error(error);
        ShowSnack('오류가 발생했습니다. 잠시 후 다시 시도해주세요', 'error', enqueueSnackbar);
      });
  }, [createPost, editor, enqueueSnackbar, history, platform, titleValue, nicknameValue, passwordValue]);

  const handleEdit = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // console.log('글 수정');

    const updatePostDto: UpdateCommunityPostDto = {
      title: titleValue,
      content: '',
    };

    if (editor.current) {
      const cont = editor.current.core.getContents(false);
      const cleanHtml = editor.current.core.cleanHTML(cont);
      updatePostDto.content = cleanHtml;
    }

    if (updatePostDto.title.trim() === '') {
      ShowSnack(ErrorMessages.title, 'error', enqueueSnackbar);
      return;
    }
    if (isEmptyContent(updatePostDto.content)) {
      ShowSnack(ErrorMessages.content, 'error', enqueueSnackbar);
      return;
    }

    editPost({ data: updatePostDto })
      .then((res) => {
        ShowSnack('글 수정 성공', 'info', enqueueSnackbar);
        history.push('/community-board');
      })
      .catch((error) => {
        console.error(error);
        ShowSnack('오류가 발생했습니다. 잠시 후 다시 시도해주세요', 'error', enqueueSnackbar);
      });
  }, [editor, editPost, enqueueSnackbar, history, titleValue]);

  function goBack() {
    history.goBack();
  }

  return (
    <CommunityBoardCommonLayout>
      <Container maxWidth="md">

        <div className={classes.title}>
          <Typography variant="h4" gutterBottom>
            {platform === 'afreeca' ? '아프리카 게시판 ' : '트위치 게시판 '}
            {isEditMode ? '글 수정' : '글 작성'}
          </Typography>
          <Divider />
        </div>

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
