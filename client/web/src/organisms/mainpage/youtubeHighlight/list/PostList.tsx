import React, { useMemo, memo } from 'react';
// import { useHistory } from 'react-router-dom';
import { Paper, Typography } from '@material-ui/core';
import {
  makeStyles, createStyles, Theme, useTheme,
} from '@material-ui/core/styles';

// 라이브러리
import { ko } from 'date-fns/locale';
import * as dateFns from 'date-fns';
import classnames from 'classnames';
// 응답타입
import { PostFound } from '@truepoint/shared/dist/res/FindPostResType.interface';
// axios객체
// import axios from '../../../../utils/axios';
// 컴포넌트
import CenterLoading from '../../../../atoms/Loading/CenterLoading';

const rowHeightBase = 10; // row(listItem)하나당 높이 기준픽셀

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    marginBottom: theme.spacing(2),
  },
  header: {
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  row: {
    display: 'flex',
    height: theme.spacing(rowHeightBase),
  },
  cell: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
  },
  cellText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  listContainer: {
    position: 'relative',
  },
  listItem: { // button 엘리먼트 사용하고 있어서 기본 기본스타일 제거
    width: '100%',
    position: 'relative',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    border: 'none',
    padding: 0,
    '&:hover': {
      backgroundColor: theme.palette.grey[100],
    },
    '&+&': {
      borderTop: `1px solid ${theme.palette.divider}`,
    },
  },
  replies: {

  },
  noDataText: {
    textAlign: 'center',
  },
  currentPostItem: {
    backgroundColor: theme.palette.secondary.light,
    '&:before': {
      position: 'absolute',
      content: '""',
      top: theme.spacing(rowHeightBase / 2),
      left: theme.spacing(1),
      transform: 'translate(0,-50%)',
      borderTop: `${theme.spacing(1)}px solid transparent`,
      borderBottom: `${theme.spacing(1)}px solid transparent`,
      borderLeft: `${theme.spacing(1.2)}px solid ${theme.palette.primary.dark}`,
    },
  },
}));

interface PostListProps {
  take: number,
  page: number,
  posts: PostFound[],
  loading?: boolean,
}

type DisplayData =
|'nickname'
|'createDate'
|'creatorId'

interface ColumnData {
  key?: DisplayData,
  text: string,
  width: string
}

// 목록 컬럼
const boardColumns: ColumnData[] = [
  { key: 'nickname', text: '방송인', width: '25%' },
  { key: 'creatorId', text: '아이디', width: '25%' },
  { key: 'createDate', text: '최신 방송일', width: '25%' },
  { text: '편집점 알아보기', width: '25%' },
];

// 날짜표현함수
function getDateDisplay(createDate: Date|undefined): string {
  let dateDisplay = '';
  if (createDate) {
    const date = new Date(createDate);
    if (date.getDate() === new Date().getDate()) { // 오늘 날짜인 경우
      // '**시간 전' 형태로 표현
      dateDisplay = `${dateFns.formatDistanceToNow(date, { locale: ko }).replace('약 ', '')} 전`;
    } else {
      // 오늘 날짜가 아닌경우 '12-26'형태로 표현
      dateDisplay = dateFns.format(date, 'MM-dd');
    }
  }
  return dateDisplay;
}

function PostList(props: PostListProps): JSX.Element {
  const {
    take,
    posts, loading,
    page,
  } = props;
  // const history = useHistory();
  const theme = useTheme();
  const classes = useStyles();
  // posts를 boardColumns의 key에 맞게 변형한다
  // boardColumns.key에 해당하는 값이 해당 열에 보여진다
  const postToDisplay = useMemo(() => (
    posts.map((post) => ({
      postId: post.postId,
      platform: post.platform,
      postNumber: post.postNumber,
      title: (
        <>
          {post.title}
          {post.repliesCount ? <span className={classes.replies}>{`[${post.repliesCount}]`}</span> : null}
        </>
      ),
      nickname: `${post.nickname}${post.category === 0 ? `(${post.ip})` : ''}`,
      createDate: `${getDateDisplay(post.createDate)}`,
      hit: page,
      recommend: post.recommend,
    }))), [classes.replies, posts, page]);

  // const moveToPost = (postId: number | undefined, platform: number | undefined) => () => {
  //   const postPlatform = platform === 0 ? 'afreeca' : 'twitch';
  //   axios.post(`/community/posts/${postId}/hit`).then(() => {
  //     history.push({
  //       pathname: `/community-board/${postPlatform}/view/${postId}`,
  //       state: {
  //         page,
  //         take,
  //       },
  //     });
  //   }).catch((e) => {
  //     console.error(e);
  //   });
  // };

  return (
    <div className={classes.root}>
      {/* 헤더 컬럼 */}
      <div className={classnames(classes.row, classes.header)}>
        {boardColumns.map((col) => (
          <div
            key={col.key}
            className={classes.cell}
            style={{ width: col.width }}
          >
            <Typography className={classes.cellText}>
              {col.text}
            </Typography>
          </div>
        ))}
      </div>

      {/* 글 목록 컨테이너 */}
      <Paper
        className={classes.listContainer}
        style={{ minHeight: `${theme.spacing(rowHeightBase) * take}px` }}
      >

        {postToDisplay.map((post) => (
          /** row 시작 */
          <div
            // onClick={moveToPost(post.postId, post.platform)}
            key={post.postId}
            className={classnames(
              classes.row,
              classes.listItem,
            )}
          >
            {boardColumns.map((col) => (
              /** col 시작 */
              <div
                key={`${post.postId}_${col.key}`}
                className={classes.cell}
                style={{ width: col.width }}
              >
                <Typography
                  noWrap
                  className={`${classes.cellText}`}
                >
                  {/* {post[col.key]} */}
                </Typography>
              </div>/** col 끝 */
            ))}
          </div>/** row 끝 */
        ))}
        {/* 데이터가 없는 경우 */}
        {(!loading && postToDisplay.length === 0)
          ? <Typography className={classes.noDataText}>데이터가 없습니다...</Typography>
          : null}
        {/* 로딩중인 경우 */}
        {loading ? <CenterLoading /> : null}
      </Paper>
    </div>
  );
}

export default memo(PostList);
