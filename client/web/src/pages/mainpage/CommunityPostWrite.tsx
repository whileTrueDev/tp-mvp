import { TextField } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import CommunityBoardCommonLayout from '../../organisms/mainpage/communityBoard/CommunityBoardCommonLayout';
// import useAxios from 'axios-hooks';
// import ShowSnack from '../../atoms/snackbar/ShowSnack';
// import { useSnackbar } from 'notistack';

export default function CommunityPostWrite(): JSX.Element {
  const { postId } = useParams<any>();
  const location = useLocation<any>();
  let platform: string | null = null;
  if (location.state) {
    platform = location.state.platform;
  }
  const isEditMode = !!postId; // postId의 여부로 글생성/글수정 모드 확인

  useEffect(() => {
    if (isEditMode) {
      // postId가 있는 경우 -> 글 수정, nickname, password 부분 숨긴다
      // fetchPost -> 글 내용 로드
    } else {
      // postId가 없는경우 -> 글 작성
      // nickname, password 부분 보임
    }
  }, []);

  function validate(e: any) {
    console.log(e.target.value);
  }
  return (
    <CommunityBoardCommonLayout>
      <div>
        {`postId : ${postId}`}
        {`platform: ${platform}`}
        {JSON.stringify(location, null, 2)}
        {postId ? '개별글 수정 페이지' : '개별글 작성 페이지'}
      </div>
      <form noValidate>
        <TextField variant="outlined" label="닉네임" onBlur={validate} />
        <TextField variant="outlined" type="password" label="비밀번호" />
      </form>
    </CommunityBoardCommonLayout>
  );
}
