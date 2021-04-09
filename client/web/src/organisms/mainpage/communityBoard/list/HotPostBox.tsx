import React from 'react';
import { PostFound } from '@truepoint/shared/res/FindPostResType.interface';
import { Button, Divider, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
import HotPostItem from './HotPostItem';

const useHotPostBoxStyle = makeStyles((theme: Theme) => {
  const decorationColor = '#ccae79';
  return createStyles({
    hotPostBox: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(6, 5),
      overflow: 'visible',
      position: 'relative',
      '&:before': {
        content: "' '",
        display: 'block',
        width: '15%',
        maxWidth: theme.spacing(15),
        minWidth: theme.spacing(10),
        height: '10%',
        backgroundColor: decorationColor,
        opacity: 0.8,
        position: 'absolute',
        left: 0,
        top: 0,
        transformOrigin: 'left top',
        transform: 'rotate(-30deg) translate(-35%,25%)',
      },
      '&:after': {
        content: "' '",
        display: 'block',
        width: '15%',
        maxWidth: theme.spacing(20),
        minWidth: theme.spacing(10),
        height: '10%',
        backgroundColor: decorationColor,
        opacity: 0.8,
        position: 'absolute',
        right: 0,
        bottom: 0,
        transformOrigin: 'right bottom',
        transform: 'rotate(-30deg) translate(35%,-25%)',
      },
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
  });
});

export interface HotPostBoxProps {
 posts: PostFound[],
 error: any,
 loading: boolean,
 platform: 'twitch' | 'afreeca'
}

export default function HotPostBox(props: HotPostBoxProps): JSX.Element {
  const classes = useHotPostBoxStyle();
  const {
    posts, error, loading, platform,
  } = props;

  const icon = <img src={`images/logo/${platform}Logo.png`} alt="로고" width="32" height="32" />;

  return (
    <section className={classes.hotPostBox}>
      <Divider />
      <div className={classes.header}>
        <div>
          <Typography component="span" color="primary">핫</Typography>
          <Typography component="span"> 시청자 반응</Typography>
        </div>
        <Button color="primary">+더보기</Button>
      </div>
      <div className={classes.listContainer}>
        {error && <Typography>데이터를 불러올 수 없습니다..</Typography>}
        {loading && <CenterLoading />}
        {!loading && !error && posts
        && posts.map((post) => <HotPostItem key={post.postId} icon={icon} post={post} />)}
      </div>
    </section>
  );
}
