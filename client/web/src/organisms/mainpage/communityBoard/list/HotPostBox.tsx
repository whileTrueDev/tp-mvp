import React from 'react';
import { PostFound } from '@truepoint/shared/res/FindPostResType.interface';
import { Button, Divider, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
import HotPostItem from './HotPostItem';
import { getBoardPlatformNameByCode } from './PostList';
import axios from '../../../../utils/axios';
import createPostItStyles from '../../../../utils/style/createPostitStyles';

const useHotPostBoxStyle = makeStyles((theme: Theme) => createStyles({
  hotPostBox: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    overflow: 'visible',
    position: 'relative',
    '&:before': createPostItStyles(theme, 'left top'),
    '&:after': createPostItStyles(theme, 'right bottom'),
  },
  listContainer: {
    height: theme.spacing(6 * 4),
    overflowY: 'scroll', // mac에서는 기본적으로 스크롤바가 숨겨진 상태임 스크롤바 라이브러리 찾아보기
    paddingRight: theme.spacing(1),
    position: 'relative',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    '&>*': {
      fontSize: theme.typography.body2.fontSize,
    },
  },
  loadMoreButton: {
    fontSize: theme.typography.body2.fontSize,
  },
}));

export interface HotPostBoxProps {
 posts: PostFound[],
 error: any,
 loading: boolean,
 platform: 'twitch' | 'afreeca',
 buttonHandler?: () => void
}

export default function HotPostBox(props: HotPostBoxProps): JSX.Element {
  const classes = useHotPostBoxStyle();
  const history = useHistory();
  const {
    posts, error, loading, platform, buttonHandler,
  } = props;

  const icon = <img src={`images/logo/${platform}Logo.png`} alt="로고" width="18" height="15" />;
  const moveToPost = (postId: number | undefined, platformCode: number | undefined) => () => {
    const postPlatform = getBoardPlatformNameByCode(platformCode);
    axios.post(`/community/posts/${postId}/hit`).then(() => {
      history.push({
        pathname: `/community-board/${postPlatform}/view/${postId}`,
      });
    }).catch((e) => {
      console.error(e);
    });
  };

  return (
    <section className={classes.hotPostBox}>
      <Divider />
      <div className={classes.header}>
        <div className={classes.title}>
          <Typography component="span">{platform === 'twitch' ? '트위치' : '아프리카'}</Typography>
          <Typography component="span" color="primary">HOT</Typography>
          <Typography component="span"> 게시물</Typography>
        </div>
        <Button className={classes.loadMoreButton} color="primary" onClick={buttonHandler}>+더보기</Button>
      </div>
      <div className={classes.listContainer}>
        {error && <Typography>데이터를 불러올 수 없습니다..</Typography>}
        {loading && <CenterLoading />}
        {!loading && !error && posts
        && posts.map((post) => (
          <HotPostItem
            key={post.postId}
            icon={icon}
            post={post}
            onClick={moveToPost(post.postId, post.platform)}
          />
        ))}
      </div>
    </section>
  );
}
