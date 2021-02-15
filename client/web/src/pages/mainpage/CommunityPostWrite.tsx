import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import useAxios from 'axios-hooks';
import { CreateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/createCommunityPost.dto';
import { UpdateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/updateCommunityPost.dto';
import { useSnackbar } from 'notistack';
import {
  Container, Button, Typography, Divider,
} from '@material-ui/core';
import CommunityBoardCommonLayout from '../../organisms/mainpage/communityBoard/CommunityBoardCommonLayout';
import usePostState from '../../organisms/mainpage/communityBoard/usePostState';
import useSunEditor from '../../organisms/mainpage/communityBoard/useSunEditor';
import TitleAndEditor from '../../organisms/mainpage/communityBoard/sub/TitleAndEditor';
import NicknamePasswordInput from '../../organisms/mainpage/communityBoard/sub/NicknamePasswordInput';
import ShowSnack from '../../atoms/snackbar/ShowSnack';

export default function CommunityPostWrite(): JSX.Element {
  const {
    postState, setContent,
  } = usePostState(); // useReducer 혹은 useContext로 바꾸기
  const { postId } = useParams<any>();
  const location = useLocation<any>();
  const history = useHistory();
  const [editorRefFn, editor] = useSunEditor();
  const nicknameRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const titleRef = useRef<HTMLInputElement>();
  const [, createPost] = useAxios({ url: '/community/posts', method: 'post' }, { manual: true });
  const [, getPostForEdit] = useAxios({ url: `/community/posts/edit/${postId}` }, { manual: true });
  const [, editPost] = useAxios({ url: `/community/posts/${postId}`, method: 'put' }, { manual: true });
  const { enqueueSnackbar } = useSnackbar();

  let platform: 'afreeca' | 'twitch'| null = null;
  if (location.state) {
    platform = location.state.platform;
  }
  const isEditMode = useMemo(() => !!postId, [postId]); // postId의 여부로 글생성/글수정 모드 확인
  const initialContent = useMemo(() => postState.content, [postState.content]);
  useEffect(() => {
    if (isEditMode) {
      // fetchPost with postId
      getPostForEdit()
        .then((res) => {
          const {
            content, title,
            // platformCode
          } = res.data;
          setContent(content);
          if (titleRef.current) {
            titleRef.current.value = title;
            titleRef.current.focus();
          }
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

  // 입력된 문자열에서 띄어쓰기,탭,공백 제외한 값이 빈 문자열인지 체크
  const isEmptyContent = useCallback((content: string): boolean => (
    content.replace(/(<\/?[^>]+(>|$)|&nbsp;|\s)/g, '') === ''),
  []);

  const handleSubmit = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // console.log('글 생성');
    const createPostDto: CreateCommunityPostDto = {
      title: '',
      content: '',
      nickname: '',
      password: '',
      platform: platform === 'afreeca' ? 0 : 1, // 아프리카=0, 트위치=1
      category: 0, // 일반글=0, 공지글=1
    };

    if (titleRef.current) {
      createPostDto.title = titleRef.current.value;
    }
    if (nicknameRef.current) {
      createPostDto.nickname = nicknameRef.current.value;
    }
    if (passwordRef.current) {
      createPostDto.password = passwordRef.current.value;
    }
    if (editor) {
      const cont = editor.core.getContents(false);
      const cleanHtml = editor.core.cleanHTML(cont);
      createPostDto.content = cleanHtml;
    }

    if (createPostDto.nickname === '') {
      ShowSnack('닉네임을 입력해주세요', 'error', enqueueSnackbar);
      return;
    }
    if (createPostDto.password === '') {
      ShowSnack('비밀번호를 입력해주세요', 'error', enqueueSnackbar);
      return;
    }
    if (createPostDto.title === '') {
      ShowSnack('제목을 입력해주세요', 'error', enqueueSnackbar);
      return;
    }
    if (isEmptyContent(createPostDto.content)) {
      ShowSnack('내용을 입력해주세요', 'error', enqueueSnackbar);
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
  }, [createPost, editor, enqueueSnackbar, history, isEmptyContent, platform]);

  const handleEdit = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // console.log('글 수정');

    const updatePostDto: UpdateCommunityPostDto = {
      title: '',
      content: '',
    };
    if (titleRef.current) {
      updatePostDto.title = titleRef.current.value;
    }
    if (editor) {
      const cont = editor.core.getContents(false);
      const cleanHtml = editor.core.cleanHTML(cont);
      updatePostDto.content = cleanHtml;
    }

    if (updatePostDto.title === '') {
      ShowSnack('제목을 입력해주세요', 'error', enqueueSnackbar);
      return;
    }
    if (isEmptyContent(updatePostDto.content)) {
      ShowSnack('내용을 입력해주세요', 'error', enqueueSnackbar);
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
  }, [editor, editPost, enqueueSnackbar, history, isEmptyContent]);

  function goBack() {
    history.goBack();
  }

  return (
    <CommunityBoardCommonLayout>
      <Container maxWidth="md">

        <div className="title">
          <Typography variant="h4" gutterBottom>
            {isEditMode ? '글수정' : '글작성'}
          </Typography>
        </div>

        <form className="form">
          {isEditMode
            ? null
            : (
              <NicknamePasswordInput
                nicknameRef={nicknameRef}
                passwordRef={passwordRef}
              />
            )}
          <TitleAndEditor
            titleRef={titleRef}
            editorRefFn={editorRefFn}
            editor={editor}
            initialContent={initialContent}
          />

          <div className="buttons">
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
