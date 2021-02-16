import React from 'react';
import {
  useHistory,
} from 'react-router-dom';
import CommunityBoardCommonLayout from '../../organisms/mainpage/communityBoard/sub/CommunityBoardCommonLayout';

export default function CommunityBoardList(): JSX.Element {
  const history = useHistory();
  return (
    <CommunityBoardCommonLayout>
      <div>
        자유게시판 페이지
        <button onClick={() => history.push('/community-board/view')}>postId 없는경우 개별글보기</button>
        <button onClick={() => history.push('/community-board/view/29')}>개별글보기</button>
        <button onClick={() => history.push({
          pathname: '/community-board/write',
          state: { platform: 'twitch' },
        })}
        >
          트위치 글작성
        </button>
        <button onClick={() => history.push({
          pathname: '/community-board/write',
          state: { platform: 'afreeca' },
        })}
        >
          아프리카 글작성

        </button>
        <button onClick={() => history.push({
          pathname: '/community-board/write/47',
          state: { platform: 'twitch' },
        })}
        >
          개별글수정

        </button>
      </div>

    </CommunityBoardCommonLayout>

  );
}
