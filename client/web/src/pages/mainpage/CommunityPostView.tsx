import React, { useEffect, useRef, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Container, Divider, Grid, Paper, Typography,
} from '@material-ui/core';
import useAxios from 'axios-hooks';
import { CommunityPost } from '@truepoint/shared/dist/interfaces/CommunityPost.interface';
import CommunityBoardCommonLayout from '../../organisms/mainpage/communityBoard/share/CommunityBoardCommonLayout';
import BoardTitle from '../../organisms/mainpage/communityBoard/share/BoardTitle';
import CenterLoading from '../../atoms/Loading/CenterLoading';
import PostInfoCard from '../../organisms/mainpage/communityBoard/postView/PostInfoCard';

import 'suneditor/dist/css/suneditor.min.css'; // suneditor로 작성된 컨텐츠를 표시하기 위해 필요함

const useStyles = makeStyles((theme: Theme) => createStyles({
  boardTitle: {},
  headerCard: {},
  viewer: {
  },
  buttons: {},
  replyContainer: {},
}));

interface LocationState{
  platform: 'afreeca'|'twitch';
}

export default function CommunityPostView(): JSX.Element {
  const { postId } = useParams<any>();
  const location = useLocation<LocationState>();
  const platform = location.state ? location.state.platform : undefined;
  const [, getPostForView] = useAxios<CommunityPost>({ url: `/community/posts/${postId}` }, { manual: true });
  const [currentPost, setCurrentPost] = useState<CommunityPost>();
  const classes = useStyles();
  const viewerRef = useRef<any>(); // 컨텐츠를 표시할 element

  useEffect(() => {
    // postId로 글 내용 불러오기
    getPostForView().then((res) => {
      console.log(res);
      setCurrentPost(res.data);
      if (viewerRef && viewerRef.current) {
        viewerRef.current.innerHTML = res.data.content;
      }
    }).catch((e) => {
      console.error(e);
    });
  }, []);

  return (
    <CommunityBoardCommonLayout>
      <Container maxWidth="md">

        <BoardTitle platform={platform} />

        {currentPost ? (
          <>
            <PostInfoCard post={currentPost} />
          </>
        ) : (
          <CenterLoading />
        )}

        <Paper ref={viewerRef} className={`${classes.viewer} sun-editor-editable`} />

        <div className={classes.buttons}>
          추천버튼 가운데(추천시 숫자만 올라가고 글을 새로 불러오지는 않음) | 오른쪽에 수정, 삭제버튼
        </div>

        <div className={classes.replyContainer}>
          {/** 댓글부분은 별도 컴포넌트 */}
          <div>전체댓글, 댓글 등록순/최신순 필터 | 본문보기, 댓글닫기, 새로고침버튼</div>
          <div>
            작성자(ㅑ아이피)   댓글내용    시간 목록
            <button>x</button>
          </div>
          <div>댓글 페이지네이션</div>
          <div>!댓글작성폼!</div>
        </div>
      </Container>

    </CommunityBoardCommonLayout>
  );
}
