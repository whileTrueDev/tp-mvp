import React, {
  useCallback, useEffect, useMemo, useRef,
} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Container, Button,
} from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
// dto
import { CreateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/createCommunityPost.dto';
import { UpdateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/updateCommunityPost.dto';
// snackbar
import { useSnackbar } from 'notistack';
import {
  checkCreatePostDto, checkUpdatePostDto, replaceResources, getHtmlFromEditor,
} from './write/WriteUtils';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
// 컴포넌트
import BoardTitle, { PLATFORM_NAMES } from './share/BoardTitle';
// 훅
import useScrollTop from '../../../utils/hooks/useScrollTop';
import useSunEditor from '../../../utils/hooks/useSunEditor';
import usePostWriteEditAPI from '../../../utils/hooks/usePostWriteEditAPI';
import WritingInputFields from './write/WritingInputFields';

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
    // suneditor다크모드 미지원이라 기존 css override함
    '& .sun-editor .se-container .se-toolbar': {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    },
    '& .sun-editor .se-container .se-wrapper': {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    },
    '& .sun-editor .se-container .se-wrapper .se-wrapper-inner': {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    },
    '& .sun-editor .se-container .se-toolbar .se-btn-tray .se-btn-module .se-menu-list li button': {
      color: theme.palette.text.primary,
    },
    marginBottom: theme.spacing(2),
  },
}));

// 게시판 코드
const platformCode = {
  afreeca: 0,
  twitch: 1,
  free: 2,
};

interface Params{
  postId?: string,
  platform: 'twitch' | 'afreeca' | 'free'
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
  const titleRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nicknameRef = useRef<HTMLInputElement>(null);

  const { postId, platform } = useParams<Params>();
  const history = useHistory();
  const { editorRef: editor, EditorContainer } = useSunEditor();
  const { handleCreatePost, handleEditPost, handleLoadPost } = usePostWriteEditAPI(Number(postId));
  const { enqueueSnackbar } = useSnackbar();

  // postId의 여부로 글생성/글수정 모드 확인
  const isEditMode = useMemo(() => !!postId, [postId]);

  useScrollTop();

  useEffect(() => {
    if (isEditMode) {
      // 글 수정하는 경우 글 내용과 제목 가져와서 보여줌
      handleLoadPost((res: { data: { content: any; title: any; }; }) => {
        const { content, title } = res.data;
        if (titleRef.current) {
          titleRef.current.value = title;
        }
        if (editor.current) {
          editor.current.setContents(content);
        }
      });
    }
  // 컴포넌트 마운트 시 한번만 실행되는 effect
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // '글 생성'
    const createPostDto: CreateCommunityPostDto = {
      title: (titleRef.current && titleRef.current.value) || '',
      content: '',
      nickname: (nicknameRef.current && nicknameRef.current.value) || '',
      password: (passwordRef.current && passwordRef.current.value) || '',
      platform: platformCode[platform], // 아프리카=0,트위치=1,자유게시판=2
      category: 0, // 일반글=0, 공지글=1
    };

    try {
      const nowContents = getHtmlFromEditor(editor);
      const imageResoureces = replaceResources(nowContents);
      createPostDto.content = imageResoureces.content;
      const checkedPostDto = checkCreatePostDto(createPostDto);

      // image가 존재하지 않을 수 있다. -> 빈 array
      if (imageResoureces.resources.length !== 0) {
        checkedPostDto.resources = imageResoureces.resources;
      }
      // createPostDto로 글 생성 요청
      handleCreatePost(checkedPostDto);
    } catch (err) {
      ShowSnack(err.message, 'error', enqueueSnackbar);
    }
  }, [platform, handleCreatePost, editor, enqueueSnackbar]);

  const handleEdit = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // '글 수정'
    const updatePostDto: UpdateCommunityPostDto = {
      title: (titleRef.current && titleRef.current.value) || '',
      content: '',
    };

    try {
      const nowContents = getHtmlFromEditor(editor);
      const imageResoureces = replaceResources(nowContents);
      updatePostDto.content = imageResoureces.content;
      const checkedPostDto = checkUpdatePostDto(updatePostDto);

      // image가 존재하지 않을 수 있다. -> 빈 array
      if (imageResoureces.resources.length !== 0) {
        checkedPostDto.resources = imageResoureces.resources;
      }
      // updatePostDto로 글 수정 요청
      handleEditPost(checkedPostDto);
    } catch (err) {
      ShowSnack(err.message, 'error', enqueueSnackbar);
    }
  }, [handleEditPost, editor, enqueueSnackbar]);

  return (
    <Container maxWidth="md">

      <BoardTitle platform={platform} title={`${PLATFORM_NAMES[platform]} 게시판`} />

      <form className="form">
        <WritingInputFields
          isEditMode={isEditMode}
          nicknameRef={nicknameRef}
          passwordRef={passwordRef}
          titleRef={titleRef}
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
  );
}
