import { Paper, Typography } from '@material-ui/core';
import React, { useMemo, memo } from 'react';
import { useHistory } from 'react-router-dom';
import {
  makeStyles, createStyles, Theme, useTheme,
} from '@material-ui/core/styles';
import { PostFound } from '@truepoint/shared/dist/res/FindPostResType.interface';
import { ko } from 'date-fns/locale';
import * as dateFns from 'date-fns';
import CenterLoading from '../../../../atoms/Loading/CenterLoading';

const rowHeightBase = 9; // row(listItem)하나당 높이 기준픽셀
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
  listItem: {
    width: '100%',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    border: 'none',
    boxSizing: 'border-box',
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
  },
}));

interface PostListProps {
  take: number,
  page: number,
  posts: PostFound[],
  loading?: boolean,
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
  { key: 'nickname', text: '작성자', width: '17%' },
  { key: 'createDate', text: '작성일', width: '15%' },
  { key: 'hit', text: '조회', width: '8%' },
  { key: 'recommend', text: '추천', width: '8%' },
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
    take, page,
    posts, loading,
    currentPostId,
  } = props;
  const history = useHistory();
  const theme = useTheme();
  const classes = useStyles();

  // posts를 boardColumns의 key에 맞게 변형한다
  // boardColumns.key에 해당하는 값이 해당 열에 보여진다
  const postToDisplay = useMemo(() => (posts.map((post) => ({
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
    const postPlatform = platform === 0 ? 'afreeca' : 'twitch';
    history.push({
      pathname: `/community-board/view/${postId}`,
      state: {
        platform: postPlatform,
        page,
        take,
      },
    });
  };

  return (
    <div className={classes.root}>
      {/* 헤더 컬럼 */}
      <div className={` ${classes.row} ${classes.header}`}>
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
          <button
            onClick={moveToPost(post.postId, post.platform)}
            key={post.postId}
            className={`${classes.row} ${classes.listItem} ${post.postId === currentPostId ? classes.currentPostItem : ''}`}
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
