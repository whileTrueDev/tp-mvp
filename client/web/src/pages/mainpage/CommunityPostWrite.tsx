import React, { useEffect, useMemo } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import CommunityBoardCommonLayout from '../../organisms/mainpage/communityBoard/CommunityBoardCommonLayout';
import usePostState from '../../organisms/mainpage/communityBoard/usePostState';
import useSunEditor from '../../organisms/mainpage/communityBoard/useSunEditor';
import EditPost from '../../organisms/mainpage/communityBoard/EditPost';
import WritePost from '../../organisms/mainpage/communityBoard/WritePost';

const temp = `
<h1 class="__se__p-neon"><span style="font-family: &quot;Courier New&quot;; font-size: 72px;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;안녕하세요</span></h1>
<div class="se-component se-video-container __se__float-none" contenteditable="false">
    <figure style="height: 302px; padding-bottom: 302px;">
        <iframe src="https://www.youtube.com/embed/usmCjDjLeT8" data-proportion="true" data-size="537px,302px" data-align="none" data-file-name="usmCjDjLeT8" data-file-size="0" data-origin="100%,56.25%" data-index="1" style="width: 537px; height: 302px;"></iframe>
    </figure>
</div>

`;

export default function CommunityPostWrite(): JSX.Element {
  const {
    postState, setNickname, setPassword, setContent,
  } = usePostState(); // useReducer 혹은 useContext로 바꾸기
  const { postId } = useParams<any>();
  const location = useLocation<any>();
  const history = useHistory();
  const [editorRefFn, editor] = useSunEditor();

  let platform: 'afreeca' | 'twitch'| null = null;
  if (location.state) {
    platform = location.state.platform;
  }
  const isEditMode = useMemo(() => !!postId, [postId]); // postId의 여부로 글생성/글수정 모드 확인
  const initialContent = useMemo(() => postState.content, [postState.content]);

  // 컴포넌트 마운트 시 한번만 실행
  useEffect(() => {
    if (isEditMode) {
      // fetchPost -> 글 내용 로드
      console.log('set content');
      setContent(temp);
    }
  }, []);

  function validate(e: any) {
    console.log(e.target.value);
    console.log(e.target.name);
    if (e.target.name === 'nickname') {
      setNickname(e.target.value);
    } else if (e.target.name === 'password') {
      setPassword(e.target.value);
    }
  }

  function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    console.log({ editor });
    if (editor) {
      const cont = editor.core.getContents(false);
      const trimmedCont = cont.replace(/(<\/?[^>]+(>|$)|&nbsp;|\s)/g, '');
      console.log({ trimmedCont, cont });
      const cleanedHtml = editor.core.cleanHTML(cont);
      alert(cleanedHtml);
    }
  }

  function goBack() {
    history.goBack();
  }

  return (
    <CommunityBoardCommonLayout>
      <div>
        {`postId : ${postId}, platform: ${platform}`}
        {isEditMode ? '개별글 수정 페이지' : '개별글 작성 페이지'}
      </div>
      {isEditMode
        ? (
          <EditPost
            editorRefFn={editorRefFn}
            editor={editor}
            postId={postId}
            initialContent={initialContent}
          />
        )
        : (
          <WritePost
            editorRefFn={editorRefFn}
            editor={editor}
          />
        )}
      <div>
        <button onClick={goBack}>취소</button>
        {isEditMode
          ? <button onClick={handleSubmit}>수정</button>
          : <button onClick={handleSubmit}>등록</button>}

      </div>

    </CommunityBoardCommonLayout>
  );
}
