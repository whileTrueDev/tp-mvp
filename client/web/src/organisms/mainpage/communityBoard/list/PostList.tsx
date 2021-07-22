import React, { useMemo, memo } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
// 라이브러리
import classnames from 'classnames';
// 응답타입
import { PostFound } from '@truepoint/shared/dist/res/FindPostResType.interface';
// axios객체
import { AxiosError } from 'axios';
import axios from '../../../../utils/axios';
// 컴포넌트
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
import { useStyles, rowHeightBase } from '../style/PostList.style';
import useMediaSize from '../../../../utils/hooks/useMediaSize';
import SmileIcon from '../../../../atoms/svgIcons/SmileIcon';
import { dayjsFormatter } from '../../../../utils/dateExpression';
import { displayNickname } from '../../../../utils/checkAvailableNickname';

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

// 날짜표현함수
function getDateDisplay(createDate: Date|undefined): string {
  let dateDisplay = '';
  if (createDate) {
    dateDisplay = dayjsFormatter(createDate, 'YY/MM/DD');
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

// 목록 컬럼
const boardColumns: ColumnData[] = [
  { key: 'postNumber', text: '번호', width: '8%' },
  { key: 'title', text: '제목', width: '44%' },
  { key: 'nickname', text: '글쓴이', width: '17%' },
  { key: 'createDate', text: '작성일', width: '15%' },
  { key: 'hit', text: '조회', width: '8%' },
  { key: 'recommend', text: '추천', width: '8%' },
];

function PostListHeader(): JSX.Element {
  const classes = useStyles();
  return (
    <div className={classnames(classes.row, classes.header)}>
      {boardColumns.map((col) => (
        <div
          key={col.key}
          className={classnames(classes.cell, classes.headerCell)}
          style={{ width: col.width }}
        >
          <Typography className={classes.cellText}>
            {col.text}
          </Typography>
        </div>
      ))}
    </div>
  );
}

interface ListProps {
  posts: PostFound[],
  currentPostId: number | undefined,
  page: number,
  take: number
}
function DesktopPostList({
  posts, currentPostId, page, take,
}: ListProps): JSX.Element {
  const classes = useStyles();
  const history = useHistory();

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
      nickname: displayNickname(post.userId, post.nickname as string),
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
    <>
      {postToDisplay.map((post) => (
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
    </>
  );
}

function MobilePostList({
  posts, currentPostId, page, take,
}: ListProps): JSX.Element {
  const history = useHistory();
  const classes = useStyles();

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

  const getPlatformImage = (platformCode: number | undefined): JSX.Element => {
    const width = 28;
    const height = 28;
    switch (platformCode) {
      case 0:
        return <img src="/images/logo/afreecaLogo.png" alt="아프리카" width={width} height={height} />;
      case 1:
        return <img src="/images/logo/twitchLogo.png" alt="트위치" width={width} height={height} />;

      default:
        return <SmileIcon width={width} height={height} />;
    }
  };

  return (
    <>
      {posts.map((post) => (
        <button
          onClick={moveToPost(post.postId, post.platform)}
          className={classnames(
            classes.row,
            classes.listItem,
            classes.mobile,
            { [classes.currentPostItem]: post.postId === currentPostId },
          )}
          key={post.postId}
        >
          <Grid container>
            <Grid item xs={2}>
              {getPlatformImage(post.platform)}
            </Grid>
            <Grid container item xs={10} direction="column" alignItems="flex-start">
              <Grid container justify="space-between">
                <Typography component="span" className={classes.mobileTitle}>
                  {post.repliesCount > 0
                    ? `${post.title} [${post.repliesCount}]`
                    : post.title}
                </Typography>
                <Typography className={classnames(classes.mobileText, classes.mobileNickname)}>
                  {displayNickname(post.userId, post.nickname as string)}
                </Typography>
              </Grid>

              <Grid container>
                <Typography component="span" color="textSecondary" className={classes.mobileText}>
                  {post.createDate ? dayjsFormatter(post.createDate).fromNow() : ''}
                </Typography>
                <Typography component="span" color="textSecondary" className={classes.mobileText}>
                  {`조회수 ${post.hit}`}
                </Typography>
                <Typography component="span" color="primary" className={classes.mobileText}>
                  {`추천 ${post.recommend}`}
                </Typography>

              </Grid>

            </Grid>

          </Grid>

        </button>

      ))}
    </>
  );
}

function PostList(props: PostListProps): JSX.Element {
  const {
    take, page,
    posts, loading, error,
    currentPostId,
  } = props;
  const { isMobile } = useMediaSize();
  const theme = useTheme();
  const classes = useStyles();

  return (
    <div className={classes.postList}>
      {/* 헤더 컬럼 */}
      { !isMobile && <PostListHeader />}

      {/* 글 목록 컨테이너 */}
      <div
        className={classes.listContainer}
        style={{ minHeight: isMobile ? 'auto' : `${theme.spacing(rowHeightBase) * take}px` }}
      >
        {error && <Typography align="center">에러가 발생했습니다. 잠시 후 다시 시도해주세요.</Typography>}
        {/* 데스크톱 화면 글 목록 아이템 */}
        {!error && !isMobile && (
          <DesktopPostList
            posts={posts}
            currentPostId={currentPostId}
            page={page}
            take={take}
          />
        )}
        {/* 모바일 화면 글 목록 아이템 */}
        {!error && isMobile && (
        <MobilePostList
          posts={posts}
          currentPostId={currentPostId}
          page={page}
          take={take}
        />
        )}

        {/* 데이터가 없는 경우 */}
        {!loading
          && posts.length === 0
          && (
            <Typography className={classes.listEmpty} align="center">작성된 게시글이 존재하지 않습니다.</Typography>
          )}

        {/* 로딩중인 경우 */}
        {loading ? <CenterLoading className={classes.listEmpty} /> : null}
      </div>
    </div>
  );
}

export default memo(PostList);
