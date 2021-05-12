import React, { useMemo, memo } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import {
  makeStyles, createStyles, Theme, useTheme,
} from '@material-ui/core/styles';

// 라이브러리
import dayjs from 'dayjs';
import classnames from 'classnames';
// 응답타입
import { PostFound } from '@truepoint/shared/dist/res/FindPostResType.interface';
// axios객체
import { AxiosError } from 'axios';
import axios from '../../../../utils/axios';
// 컴포넌트
import CenterLoading from '../../../../atoms/Loading/CenterLoading';

const rowHeightBase = 6; // row(listItem)하나당 높이 기준픽셀

const useStyles = makeStyles((theme: Theme) => createStyles({
  postList: {
  },
  header: {
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
    '& $cellText': {
      color: theme.palette.common.white,
    },
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
    color: theme.palette.text.primary,
    fontSize: theme.typography.h6.fontSize,
  },
  listContainer: {
    position: 'relative',
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? '100' : 'A400'],
  },
  listItem: { // button 엘리먼트 사용하고 있어서 기본 기본스타일 제거
    width: '100%',
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    cursor: 'pointer',
    border: 'none',
    borderBottom: `0.5px solid ${theme.palette.divider}`,
    padding: 0,
    '&:hover': {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.action.hover : theme.palette.grey[700],
    },
  },
  replies: {

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
  error?: AxiosError<any> | undefined,
  currentPostId?: number
}

type DisplayData =
|'postNumber'
|'title'
|'nickname'
|'createDate'
|'hit'
|'recommend';

interface ColumnData {
  key: DisplayData,
  text: string,
  width: string
}

// 목록 컬럼
const boardColumns: ColumnData[] = [
  { key: 'postNumber', text: '번호', width: '8%' },
  { key: 'title', text: '제목', width: '44%' },
  { key: 'nickname', text: '글쓴이', width: '17%' },
  { key: 'createDate', text: '작성일', width: '15%' },
  { key: 'hit', text: '조회', width: '8%' },
  { key: 'recommend', text: '추천', width: '8%' },
];

// 날짜표현함수
function getDateDisplay(createDate: Date|undefined): string {
  let dateDisplay = '';
  if (createDate) {
    dateDisplay = dayjs(createDate).format('MM-DD');
  }
  return dateDisplay;
}

export function getBoardPlatformNameByCode(platform: number | undefined): string {
  switch (platform) {
    case 0:
      return 'afreeca';
    case 1:
      return 'twitch';
    case 2:
      return 'free';
    default:
      return 'free';
  }
}

function PostList(props: PostListProps): JSX.Element {
  const {
    take, page,
    posts, loading, error,
    currentPostId,
  } = props;
  const history = useHistory();
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
      hit: post.hit,
      recommend: post.recommend,
    }))), [classes.replies, posts]);

  const moveToPost = (postId: number | undefined, platform: number | undefined) => () => {
    const postPlatform = getBoardPlatformNameByCode(platform);
    axios.post(`/community/posts/${postId}/hit`).then(() => {
      history.push({
        pathname: `/community-board/${postPlatform}/view/${postId}`,
        state: {
          page,
          take,
        },
      });
    }).catch((e) => {
      console.error(e);
    });
  };

  return (
    <div className={classes.postList}>
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
      <div
        className={classes.listContainer}
        style={{ minHeight: `${theme.spacing(rowHeightBase) * take}px` }}
      >
        {error && <Typography align="center">에러가 발생했습니다. 잠시 후 다시 시도해주세요.</Typography>}
        {!error && postToDisplay.map((post) => (
          /** row 시작 */
          <button
            onClick={moveToPost(post.postId, post.platform)}
            key={post.postId}
            className={classnames(
              classes.row,
              classes.listItem,
              { [classes.currentPostItem]: post.postId === currentPostId },
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
                  {post[col.key]}
                </Typography>
              </div>/** col 끝 */
            ))}
          </button>/** row 끝 */
        ))}
        {/* 데이터가 없는 경우 */}
        {!loading
        && postToDisplay.length === 0
        && <Typography align="center">데이터가 없습니다...</Typography>}
        {/* 로딩중인 경우 */}
        {loading ? <CenterLoading /> : null}
      </div>
    </div>
  );
}

export default memo(PostList);
