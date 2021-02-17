import { Grid } from '@material-ui/core';
import React, { useRef, useState } from 'react';
import {
  useHistory,
} from 'react-router-dom';
import CommunityBoardCommonLayout from '../../organisms/mainpage/communityBoard/sub/CommunityBoardCommonLayout';
import ProductHero from '../../organisms/mainpage/shared/ProductHero';
import BoardContainer from '../../organisms/mainpage/communityBoard/sub/BoardContainer';
import SelectField from '../../atoms/SelectField';

export default function CommunityBoardList(): JSX.Element {
  const history = useHistory();
  const select = useRef<Array<number>>([8, 16]);
  const [take, setTake] = useState<number>(select.current[0]);

  return (
    <CommunityBoardCommonLayout>
      <ProductHero title="자유게시판" content="자유게시판입니다" />
      <Grid container spacing={2} justify="space-between" alignItems="flex-start" style={{ width: '90%', margin: '0 auto', minWidth: '1200px' }}>
        <Grid
          item
          style={{
            border: '2px solid black', width: '48%', minWidth: '600px', minHeight: ' 700px',
          }}
        >
          <BoardContainer
            platform="afreeca"
            take={take}
            selectComponent={<SelectField handleCallback={setTake} value={take} select={select.current} />}
          />
        </Grid>
        <Grid
          item
          style={{
            border: '2px solid black', width: '48%', minWidth: '600px', minHeight: ' 700px',
          }}
        >
          <BoardContainer
            platform="twitch"
            selectComponent={<SelectField handleCallback={setTake} value={take} select={select.current} />}
          />
        </Grid>
      </Grid>
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
